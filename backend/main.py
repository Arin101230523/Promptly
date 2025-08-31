import os
import uuid
import json
from datetime import datetime
from urllib.parse import urljoin, urlparse
import heapq
from typing import Dict, List, Set, Tuple, Optional
import re

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, WebDriverException
from groq import Groq

# -----------------------
# Setup
# -----------------------
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = {}

class TaskCreate(BaseModel):
    url: str
    goal: str

# -----------------------
# Utility functions
# -----------------------

def fetch_page_html(driver, url: str, timeout=10) -> str:
    """Fetch page using Selenium with timeout."""
    try:
        driver.set_page_load_timeout(timeout)
        driver.get(url)
        return driver.page_source
    except TimeoutException:
        print(f"Timeout fetching {url}")
        return ""
    except WebDriverException as e:
        print(f"WebDriver error fetching {url}: {e}")
        return ""
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def extract_visible_text(html: str) -> str:
    """Extract visible text from HTML."""
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style"]):
        script.decompose()
    return soup.get_text(separator="\n", strip=True)

def extract_links_with_context(base_url: str, html: str) -> Dict[str, Dict]:
    """Extract internal links with their anchor text and surrounding context."""
    if not html:
        return {}
    
    soup = BeautifulSoup(html, "html.parser")
    domain = urlparse(base_url).netloc
    links_with_context = {}
    
    for a in soup.find_all("a", href=True):
        try:
            url = urljoin(base_url, a["href"])
            # Remove fragment and trailing slash for consistency
            url = url.split("#")[0].rstrip("/")
            parsed = urlparse(url)
            
            # Only include URLs from the same domain
            if parsed.netloc == domain and parsed.scheme in ['http', 'https']:
                # Get anchor text
                anchor_text = a.get_text(strip=True)
                
                # Get surrounding context (parent element text)
                parent_text = ""
                if a.parent:
                    parent_text = a.parent.get_text(strip=True)[:200]  # Limit context length
                
                # Get any title or aria-label attributes
                title = a.get('title', '')
                aria_label = a.get('aria-label', '')
                
                links_with_context[url] = {
                    'anchor_text': anchor_text,
                    'parent_context': parent_text,
                    'title': title,
                    'aria_label': aria_label,
                    'url_path': parsed.path
                }
        except Exception as e:
            print(f"Error processing link {a.get('href')}: {e}")
            continue
    
    return links_with_context

def extract_first_json(text: str) -> dict:
    """Extract the first valid JSON object from a string."""
    try:
        # Remove code block markers if present
        if text.startswith("```"):
            lines = text.split('\n')
            text = '\n'.join(lines[1:-1]) if len(lines) > 2 else text
        # Find first {...} block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
        # Fallback: try to parse whole text
        return json.loads(text)
    except Exception as e:
        print(f"extract_first_json failed: {e}")
        raise

def smart_url_scoring(url: str, link_context: Dict, goal: str) -> Tuple[float, str]:
    """Enhanced URL scoring using both URL structure and link context."""
    
    # Prepare context for AI
    context_info = f"""
URL: {url}
Anchor Text: {link_context.get('anchor_text', 'N/A')}
Title Attribute: {link_context.get('title', 'N/A')}
Aria Label: {link_context.get('aria_label', 'N/A')}
URL Path: {link_context.get('url_path', 'N/A')}
Surrounding Context: {link_context.get('parent_context', 'N/A')[:100]}
"""
    
    prompt = f"""You are analyzing a URL and its context for relevance to a specific goal.

Goal: {goal}

Link Information:
{context_info}

Based on ALL available information (URL structure, anchor text, surrounding context), rate how likely this URL is to contain the information needed to satisfy the goal.

Consider:
1. Does the anchor text directly mention what we're looking for?
2. Does the URL path suggest it contains the target information?
3. Does the surrounding context indicate this link leads to relevant content?
4. Would this typically be where such information is found on websites?

Rate on a scale of 0-10 where:
- 0-2 = Definitely irrelevant
- 3-4 = Probably irrelevant
- 5-6 = Possibly relevant
- 7-8 = Probably relevant
- 9-10 = Almost certainly contains the answer

IMPORTANT: Only return values between 0 and 10 for score. Do not exceed these bounds.

Return only a JSON object:
{{"score": <number>, "reasoning": "<one-line explanation>"}}"""

    try:
        response = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=150
        )
        
        content = response.choices[0].message.content.strip()
        try:
            result = extract_first_json(content)
        except Exception as e:
            print(f"Error parsing smart_url_scoring JSON: {e}")
            # fallback
            result = {}
        score = float(result.get("score", 0))
        reasoning = result.get("reasoning", "")
        return max(0, min(10, score)), reasoning
        
    except Exception as e:
        print(f"Error scoring URL {url}: {e}")
        # Fallback to simple heuristic
        path_lower = url.lower()
        if any(term in goal.lower() for term in ['component', 'ui', 'element']) and 'component' in path_lower:
            return 8.0, "Heuristic: URL contains 'component'"
        elif any(term in path_lower for term in ['doc', 'api', 'reference', 'guide']):
            return 6.0, "Heuristic: Documentation page"
        return 3.0, "Heuristic: Default score"

def analyze_landing_page_completeness(text: str, goal: str, links_context: Dict[str, Dict]) -> Dict:
    """Analyze if the landing page likely has all needed information or if we need to explore further."""
    
    # Prepare link summaries
    link_summaries = []
    for url, context in list(links_context.items())[:20]:  # Limit to top 20 links
        if context['anchor_text']:
            link_summaries.append(f"- {context['anchor_text']} ({url.split('/')[-1] or 'home'})")
    
    prompt = f"""Analyze whether this webpage contains all the information needed to satisfy the goal, or if we need to explore linked pages.

Goal: {goal}

Current Page Content (first 3000 chars):
{text[:3000]}

Available Links on Page:
{chr(10).join(link_summaries[:15])}

Based on the content and available links, determine:
1. Does this page COMPLETELY satisfy the goal with actual data (not just navigation/categories)?
2. If not, which linked pages are MOST likely to contain the answer?
3. What's the confidence that this page alone answers the question?

For example:
- If goal is "find all components" and page only shows "Components, Blocks, Charts" - these are categories, NOT complete
- If goal is "find pricing" and page shows actual prices - this IS complete
- If goal is "get contact info" and you see actual email/phone - this IS complete

IMPORTANT: Only return values between 0 and 10 for confidence. Do not exceed these bounds.

Return JSON:
{{
    "is_complete": true/false,
    "confidence": 0-10,
    "data_found": {{"description": "what data was found", "items": []}},
    "recommended_links": ["url1", "url2"],
    "reasoning": "explanation"
}}"""

    try:
        response = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=500
        )
        
        content = response.choices[0].message.content.strip()
        try:
            return extract_first_json(content)
        except Exception as e:
            print(f"Error parsing analyze_landing_page_completeness JSON: {e}")
            return {
                "is_complete": False,
                "confidence": 0,
                "data_found": {},
                "recommended_links": [],
                "reasoning": f"Analysis failed: {e}"
            }
        
    except Exception as e:
        print(f"Error analyzing landing page: {e}")
        return {
            "is_complete": False,
            "confidence": 0,
            "data_found": {},
            "recommended_links": [],
            "reasoning": f"Analysis failed: {e}"
        }

def extract_data_from_page(text: str, goal: str, url: str) -> Dict:
    """Extract structured data from page content."""
    prompt = f"""Extract structured data from this webpage that answers the goal.

URL: {url}
Goal: {goal}
Content (first 4000 chars): {text[:4000]}

IMPORTANT: 
- Extract ACTUAL DATA, not categories or navigation items
- For "all components": list actual component names like Button, Card, Dialog, NOT categories like "Components"
- For "pricing": extract actual prices and plan details
- For "API endpoints": extract actual endpoint URLs and methods

If you find the actual data that satisfies the goal, return it structured.
If you only find navigation/categories pointing to the data, return satisfies_goal: false.

IMPORTANT: Only return values between 0 and 10 for confidence. Do not exceed these bounds.

Return JSON:
{{
    "satisfies_goal": true/false,
    "data": <extracted structured data or null>,
    "confidence": 0-10,
    "item_count": <number of actual items found>,
    "data_type": "<what type of data was found: actual_data|categories|navigation|none>"
}}"""

    try:
        response = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        try:
            return extract_first_json(content)
        except Exception as e:
            print(f"Error parsing extract_data_from_page JSON: {e}")
            return {
                "satisfies_goal": False,
                "data": None,
                "confidence": 0,
                "item_count": 0,
                "data_type": "none"
            }
        
    except Exception as e:
        print(f"Error extracting data: {e}")
        return {
            "satisfies_goal": False,
            "data": None,
            "confidence": 0,
            "item_count": 0,
            "data_type": "none"
        }

def clamp_confidence(conf):
    """Clamp/normalize confidence to 0-10 range."""
    try:
        conf = float(conf)
        if 0 < conf < 1:
            conf = conf * 10
        return max(0, min(10, conf))
    except Exception:
        return 0

def smart_explore_site(driver, start_url: str, goal: str, max_pages=15):
    """Intelligent site exploration with early stopping and smart page selection."""
    
    visited_urls = set()
    exploration_history = []
    all_results = []
    
    print(f"\n{'='*60}")
    print(f"Starting SMART exploration for goal: {goal}")
    print(f"Target site: {start_url}")
    print(f"{'='*60}\n")
    
    # Phase 1: Analyze landing page thoroughly
    print("PHASE 1: Landing Page Analysis")
    print("-" * 40)

    landing_html = fetch_page_html(driver, start_url)
    if not landing_html:
        return {"error": "Failed to fetch landing page"}

    landing_text = extract_visible_text(landing_html)
    links_with_context = extract_links_with_context(start_url, landing_html)

    print(f"✓ Fetched landing page: {len(landing_text)} chars")
    print(f"✓ Found {len(links_with_context)} internal links")

    print("\nAnalyzing landing page content...")
    landing_analysis = analyze_landing_page_completeness(landing_text, goal, links_with_context)
    print(f"Landing page completeness: {landing_analysis.get('confidence', 0)}/10")
    print(f"Reasoning: {landing_analysis.get('reasoning', 'N/A')}")

    visited_urls.add(start_url)
    exploration_history.append(start_url)

    # Always attempt extraction from the landing page first
    landing_extraction = extract_data_from_page(landing_text, goal, start_url)
    landing_extraction_conf = clamp_confidence(landing_extraction.get('confidence', 0))
    landing_extraction['confidence'] = landing_extraction_conf

    if landing_extraction.get('satisfies_goal') and landing_extraction_conf >= 8:
        print("\n✅ Landing page contains high-confidence answer!")
        print("\nPHASE 4: Result Compilation")
        print("-" * 40)
        return {
            "data": landing_extraction['data'],
            "metadata": {
                "start_url": start_url,
                "successful_url": start_url,
                "pages_processed": 1,
                "exploration_history": exploration_history,
                "confidence": landing_extraction_conf,
                "item_count": landing_extraction.get('item_count', 0),
                "strategy": "landing_page_sufficient",
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    # Phase 2: Smart exploration of high-priority pages
    print("\nPHASE 2: Smart Link Prioritization")
    print("-" * 40)
    
    # Score all links with context
    scored_links = []
    for url, context in links_with_context.items():
        if url not in visited_urls:
            score, reasoning = smart_url_scoring(url, context, goal)
            scored_links.append((score, url, reasoning, context))
            if score >= 7:  # Only print high-scoring links
                print(f"Score {score:.1f}: {context.get('anchor_text', url.split('/')[-1])[:30]} - {reasoning[:50]}")
    
    # Sort by score
    scored_links.sort(reverse=True)
    
    # Identify must-explore pages (score >= 9)
    must_explore = [link for link in scored_links if link[0] >= 9]
    high_priority = [link for link in scored_links if 7 <= link[0] < 9]
    
    print(f"\n📊 Link Analysis:")
    print(f"  - Must explore (score ≥ 9): {len(must_explore)} pages")
    print(f"  - High priority (score 7-9): {len(high_priority)} pages")
    print(f"  - Total pages to consider: {len(scored_links)}")
    
    # Phase 3: Explore high-priority pages
    print("\nPHASE 3: Targeted Exploration")
    print("-" * 40)
    
    pages_to_explore = must_explore + high_priority[:5]  # Explore must-visit and top 5 high priority
    pages_processed = 1  # Landing page already processed
    best_result = None
    best_confidence = clamp_confidence(landing_analysis.get('confidence', 0))

    if landing_analysis.get('data_found'):
        best_result = {
            "url": start_url,
            "data": landing_analysis.get('data_found'),
            "confidence": best_confidence
        }

    for score, url, reasoning, context in pages_to_explore:
        if pages_processed >= max_pages:
            print(f"\n⚠️ Reached max pages limit ({max_pages})")
            break
            
        if url in visited_urls:
            continue
            
        print(f"\nExploring: {context.get('anchor_text', url.split('/')[-1])[:50]}")
        print(f"  URL: {url}")
        print(f"  Score: {score:.1f} - {reasoning[:60]}")
        
        html = fetch_page_html(driver, url)
        if not html:
            print(f"  ❌ Failed to fetch")
            continue
        
        text = extract_visible_text(html)
        if not text.strip():
            print(f"  ❌ No visible content")
            continue
        
        visited_urls.add(url)
        exploration_history.append(url)
        pages_processed += 1
        
        # Extract data from this page
        extraction = extract_data_from_page(text, goal, url)
        extraction_conf = clamp_confidence(extraction.get('confidence', 0))
        extraction['confidence'] = extraction_conf
        if extraction['confidence'] > best_confidence and extraction['satisfies_goal']:
            best_confidence = extraction['confidence']
            best_result = {
                "url": url,
                "data": extraction['data'],
                "confidence": extraction['confidence']
            }
        
        # If we found high-confidence answer, we can stop
        if extraction['satisfies_goal'] and extraction['confidence'] >= 9:
            print("\n✅ Found high-confidence answer!")
            # Optionally, always print Phase 4 formatting here:
            print("\nPHASE 4: Result Compilation")
            print("-" * 40)
            return {
                "data": extraction['data'],
                "metadata": {
                    "start_url": start_url,
                    "successful_url": url,
                    "pages_processed": pages_processed,
                    "exploration_history": exploration_history,
                    "confidence": extraction['confidence'],
                    "item_count": extraction.get('item_count', 0),
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
        
        # Early stopping if we have a good answer and no more must-explore pages
        if best_result and best_result.get('confidence', 0) >= 8 and score < 9:
            print(f"\n✓ Have good answer (confidence {best_result['confidence']}), no more critical pages to explore")
            break
    
    # Phase 4: Result Compilation
    print("\nPHASE 4: Result Compilation")
    print("-" * 40)

    # Return best result that satisfies the goal and has confidence >= 7
    if best_result and best_result.get('confidence', 0) >= 7:
        print(f"✓ Returning best result with confidence {best_result['confidence']}/10")
        return {
            "data": best_result['data'],
            "metadata": {
                "start_url": start_url,
                "successful_url": best_result['url'],
                "pages_processed": pages_processed,
                "exploration_history": exploration_history,
                "confidence": best_result['confidence'],
                "partial_result": best_result['confidence'] < 8,
                "strategy": "best_available",
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    # If no result with confidence >= 7, try to return the best that satisfies the goal
    if best_result and best_result.get('confidence', 0) > 0 and best_result.get('data'):
        print(f"✓ Returning best available result with confidence {best_result['confidence']}/10")
        return {
            "data": best_result['data'],
            "metadata": {
                "start_url": start_url,
                "successful_url": best_result['url'],
                "pages_processed": pages_processed,
                "exploration_history": exploration_history,
                "confidence": best_result['confidence'],
                "partial_result": True,
                "strategy": "partial_data",
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    print("❌ Could not find satisfactory answer")
    return {
        "error": "Could not find information to satisfy the goal",
        "metadata": {
            "start_url": start_url,
            "pages_processed": pages_processed,
            "exploration_history": exploration_history,
            "all_results": all_results,
            "timestamp": datetime.utcnow().isoformat()
        }
    }

# -----------------------
# API Endpoints
# -----------------------

@app.post("/create-task/")
def create_task(task: TaskCreate):
    """Create a new crawling task."""
    task_id = str(uuid.uuid4())
    tasks[task_id] = {"url": task.url, "goal": task.goal, "status": "created"}
    return {"task_id": task_id, "endpoint": f"/run-task/{task_id}"}

@app.get("/run-task/{task_id}")
def run_task(task_id: str):
    """Execute a crawling task."""
    if task_id not in tasks:
        return {"error": "Task not found"}
    
    task = tasks[task_id]
    start_url = task["url"]
    goal = task["goal"]
    
    print(f"Running task {task_id}: {goal} on {start_url}")
    
    # Setup Chrome driver
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-images")
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    chrome_options.add_argument("--log-level=3")
    
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        tasks[task_id]["status"] = "running"
        
        result = smart_explore_site(driver, start_url, goal, max_pages=15)
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["result"] = result
        
        return result
        
    except Exception as e:
        error_result = {
            "error": f"Task execution failed: {str(e)}",
            "metadata": {
                "task_id": task_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["result"] = error_result
        return error_result
        
    finally:
        if driver:
            driver.quit()

@app.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """Get the status of a task."""
    if task_id not in tasks:
        return {"error": "Task not found"}
    
    task = tasks[task_id]
    return {
        "task_id": task_id,
        "status": task.get("status", "unknown"),
        "url": task["url"],
        "goal": task["goal"],
        "result": task.get("result", None)
    }
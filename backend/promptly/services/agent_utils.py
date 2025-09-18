import json
import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException, WebDriverException
from arcadepy import Arcade
from promptly.clients.groq_client import client as llm_client
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def fetch_page_html(driver, url: str, timeout=30) -> str:
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

def extract_links_with_context(base_url: str, html: str) -> dict:
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

def clamp_confidence(conf):
    """Clamp/normalize confidence to 0-10 range."""
    try:
        conf = float(conf)
        if 0 < conf < 1:
            conf = conf * 10
        return max(0, min(10, conf))
    except Exception:
        return 0

# Helper functions for agentic email

def should_send_email_and_extract_address(goal, result):
    """
    Use LLM to decide if an email should be sent and extract the email address from the goal/prompt.
    Returns: dict {"send_email": bool, "email_address": str or None, "reasoning": str}
    """
    prompt = f"""
    Decide if the result should be sent via email to the user, and extract the email address if present.
    Goal: {goal}
    Result: {str(result)[:1000]}

    Instructions:
    - Only set send_email to true if the user explicitly requests or implies they want the result emailed, and you know the email address to send to.
    - Extract the email address from the goal if present. If not present, set email_address to null.
    - If send_email is false, set email_address to null.

    Respond with JSON:
    {{
        "send_email": true/false,
        "email_address": "user@email.com" or null,
        "reasoning": "short explanation"
    }}
    """
    try:
        response = llm_client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
        )
        content = response.choices[0].message.content.strip()
        decision = extract_first_json(content)
        return {
            "send_email": decision.get("send_email", False),
            "email_address": decision.get("email_address", None),
            "reasoning": decision.get("reasoning", "")
        }
    except Exception as e:
        print(f"[should_send_email_and_extract_address] LLM decision failed: {e}")
        return {"send_email": False, "email_address": None, "reasoning": str(e)}

def send_email_via_arcade(email_address, result):
    try:
        API_KEY = os.getenv("ARCADE_API_KEY")
        USER_ID = os.getenv("USER_ID")
        client = Arcade(api_key=API_KEY)
        auth_response = client.tools.authorize(
            tool_name="Gmail.SendEmail@3.1.0",
            user_id=USER_ID,
        )
        if auth_response.status != "completed":
            print(f"Click this link to authorize: {auth_response.url}")
            auth_response = client.auth.wait_for_completion(auth_response)
        if auth_response.status != "completed":
            print("Authorization failed for Arcade Gmail tool.")
        else:
            email_result = client.tools.execute(
                tool_name="Gmail.SendEmail@3.1.0",
                input={
                    "recipient": email_address,
                    "subject": "Promptly Agent Response",
                    "body": str(result),
                    "owner": "ArcadeAI",
                    "name": "arcade-ai",
                    "starred": "true",
                },
                user_id=USER_ID,
            )
            print(email_result)
    except Exception as e:
        print(f"[send_email_via_arcade] Email sending failed: {e}")

def group_similar_links(links_with_context, similarity_threshold=0.5, embedding_model_name='all-MiniLM-L6-v2'):
    """
    Groups links by semantic similarity of their anchor and context text.
    Args:
        links_with_context: dict of {url: {anchor_text, parent_context, ...}}
        similarity_threshold: float, minimum cosine similarity to group links
        embedding_model_name: str, sentence-transformers model name
    Returns:
        List of groups, each group is a list of URLs (similar links)
    """
    if not links_with_context:
        return []
    model = SentenceTransformer(embedding_model_name)
    texts = [
        (url, (ctx.get('anchor_text', '') + ' ' + ctx.get('parent_context', '')))
        for url, ctx in links_with_context.items()
    ]
    url_list = [url for url, _ in texts]
    text_list = [text for _, text in texts]
    embeddings = model.encode(text_list, show_progress_bar=False)
    sim_matrix = cosine_similarity(embeddings)
    n = len(url_list)
    visited = set()
    groups = []
    for i in range(n):
        if i in visited:
            continue
        group = [url_list[i]]
        visited.add(i)
        for j in range(i+1, n):
            if j not in visited and sim_matrix[i][j] >= similarity_threshold:
                group.append(url_list[j])
                visited.add(j)
        groups.append(group)
    return groups
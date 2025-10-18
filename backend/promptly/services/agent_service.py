from datetime import datetime
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum
import json
import random

from promptly.clients.groq_client import client
from promptly.services.agent_utils import (
    fetch_page_html,
    extract_visible_text,
    extract_links_with_context,
    extract_first_json,
    clamp_confidence,
    should_send_email_and_extract_address,
    send_email_via_arcade
)


class ExplorationStrategy(Enum):
    FIRST_PAGE_SUFFICIENT = "first_page_sufficient"
    BATCH_EXPLORATION = "batch_exploration"
    MULTI_BATCH_EXPLORATION = "multi_batch_exploration"
    EXHAUSTIVE_EXPLORATION = "exhaustive_exploration"
    PARTIAL_DATA = "partial_data"


@dataclass
class ExplorationResult:
    data: Any = None
    confidence: float = 0.0
    url: str = ""
    reasoning: str = ""
    item_count: int = 0
    satisfies_goal: bool = False
    data_type: str = "none"
    
    def __post_init__(self):
        self.confidence = max(0.0, min(10.0, float(self.confidence)))


@dataclass
class LinkScore:
    score: float
    url: str
    reasoning: str
    context: Dict[str, Any]
    
    def __post_init__(self):
        self.score = max(0.0, min(10.0, float(self.score)))


@dataclass
class ExplorationContext:
    start_url: str
    goal: str
    max_pages: int = 20
    confidence_threshold: float = 8.0
    max_concurrent: int = 5
    batch_size: int = 5
    min_score_threshold: float = 7.0
    visited_urls: set = field(default_factory=set)
    exploration_history: list = field(default_factory=list)
    current_best: Optional[ExplorationResult] = None
    all_results: list = field(default_factory=list)
    links: Dict[str, Any] = field(default_factory=dict)
    
    def add_visited_url(self, url: str):
        self.visited_urls.add(url)
        self.exploration_history.append(url)
    
    def update_best_result(self, result: ExplorationResult):
        self.all_results.append(result)
        if (not self.current_best or 
            (result.satisfies_goal and not self.current_best.satisfies_goal) or
            (result.satisfies_goal == self.current_best.satisfies_goal and 
             result.confidence > self.current_best.confidence)):
            self.current_best = result


def get_random_user_agent():
    """Return a random user-agent string from a list of common browsers."""
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    ]
    return random.choice(user_agents)


class Agent(ABC):
    """Base agent interface for web exploration"""
    
    def __init__(self, name: str, ai_client=None):
        self.name = name
        self.ai_client = ai_client or client
    
    @abstractmethod
    def execute(self, context: ExplorationContext, **kwargs) -> Any:
        """Execute the agent's task"""
        pass
    
    def log(self, message: str):
        print(f"[{self.name}] {message}")


class URLScoringAgent(Agent):
    """Agent responsible for scoring URLs based on relevance to the goal"""
    
    def __init__(self, name: str = "URLScorer"):
        super().__init__(name, client)
    
    def execute(self, context: ExplorationContext, url: str, link_context: dict, **kwargs) -> LinkScore:
        """Score a single URL for relevance to the goal"""
        score, reasoning = self.smart_url_scoring(url, link_context, context.goal)
        return LinkScore(score=score, url=url, reasoning=reasoning, context=link_context)
    
    def smart_url_scoring(self, url: str, link_context: dict, goal: str) -> tuple:
        """Enhanced URL scoring using both URL structure and link context."""
        
        context_info = f"""
URL: {url}
Anchor Text: {link_context.get('anchor_text', 'N/A')}
Title Attribute: {link_context.get('title', 'N/A')}
Aria Label: {link_context.get('aria_label', 'N/A')}
URL Path: {link_context.get('url_path', 'N/A')}
Surrounding Context: {link_context.get('parent_context', 'N/A')[:100]}
"""
        
        prompt = f"""
You are an expert web explorer agent. Your job is to score how likely a given link is to contain the answer to a specific user goal.

Goal: {goal}

Link Information:
{context_info}

SCORING PRIORITY INSTRUCTIONS:
- If the anchor text, URL path, or surrounding context contains an exact or close match to the main product, item, or query terms in the goal (e.g., product name, brand, or specific keywords), prioritize that link and give it a HIGH score (9-10).
- Prefer links that literally mention the product, item, or query terms over generic links (e.g., "Nike Ava Rover shoes" is much better than "Shop Now" or "Shoes").
- If the link is generic or only about navigation, categories, or unrelated info, score it LOW (0-3).
- If the link is about size charts or product details and matches the product in the goal, score HIGH.
- If the link is about help, shipping, or unrelated brands, score LOW.

Consider:
1. Does the anchor text directly mention the product, item, or query terms from the goal?
2. Does the URL path contain the product name or relevant keywords?
3. Does the surrounding context indicate this link leads to the specific answer?
4. Would this typically be where such information is found on websites?

Rate on a scale of 0-10 where:
- 0-2 = Definitely irrelevant
- 3-4 = Probably irrelevant
- 5-6 = Possibly relevant
- 7-8 = Probably relevant
- 9-10 = Almost certainly contains the answer

IMPORTANT: Only return values between 0 and 10 for score. Do not exceed these bounds.

Return only a JSON object:
{{"score": <number>, "reasoning": "<one-line explanation>"}}
"""

        try:
            response = self.ai_client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
            )
            
            content = response.choices[0].message.content.strip()
            try:
                result = extract_first_json(content)
            except Exception as e:
                print(f"Error parsing smart_url_scoring JSON: {e}")
                result = {}
            score = float(result.get("score", 0))
            reasoning = result.get("reasoning", "")
            return max(0, min(10, score)), reasoning
            
        except Exception as e:
            print(f"Error scoring URL {url}: {e}")
            return 0.0, "AI scoring failed"


class DataExtractionAgent(Agent):
    """Agent for extracting structured data from page content"""
    
    def __init__(self, name: str = "DataExtractor"):
        super().__init__(name, client)
    
    def execute(self, context: ExplorationContext, text: str, url: str, **kwargs) -> ExplorationResult:
        """Extract structured data from page content"""
        result = self.extract_data_from_page(text, context.goal, url)
        
        return ExplorationResult(
            data=result.get('data'),
            confidence=clamp_confidence(result.get('confidence', 0)),
            url=url,
            reasoning=result.get('reasoning', ''),
            item_count=result.get('item_count', 0),
            satisfies_goal=result.get('satisfies_goal', False),
            data_type=result.get('data_type', 'none')
        )
    
    def extract_data_from_page(self, text: str, goal: str, url: str) -> dict:
        """Extract structured data from page content with strict validation."""
        prompt = f"""Extract structured data from this webpage that answers the goal.

URL: {url}
Goal: {goal}
Content (first 4000 chars): {text[:4000]}

CRITICAL INSTRUCTIONS:
- ONLY return high confidence (8-10) if you find ACTUAL DATA that directly answers the goal
- If you only see navigation links, categories, or mentions without actual data, confidence should be LOW (0-3)
- For "What components does this ui library offer?": You need actual component NAMES (Button, Card, Dialog), not just the word "Components"
- For "pricing": You need actual prices ($10, $20), not just the word "pricing"
- For "API endpoints": You need actual URLs (/api/users, /api/posts), not just "API documentation"

Examples of what counts as ACTUAL DATA vs NAVIGATION:
- ACTUAL DATA: "Button, Card, Dialog, Dropdown, Modal" (component names)
- NAVIGATION: "Components" (just a category link)
- ACTUAL DATA: "Basic Plan: $10/month, Pro Plan: $30/month" (actual pricing)
- NAVIGATION: "Pricing" (just a category link)

If you find ACTUAL DATA: set confidence 7-10 and satisfies_goal: true
If you find only NAVIGATION/CATEGORIES: set confidence 0-3 and satisfies_goal: false

IMPORTANT: Only return values between 0 and 10 for confidence. Do not exceed these bounds.

Return JSON:
{{
    "satisfies_goal": true/false,
    "data": <extracted structured data or null>,
    "confidence": 0-10,
    "item_count": <number of actual data items found>,
    "data_type": "<actual_data|categories|navigation|none>",
    "reasoning": "<explain why this confidence level>"
}}"""

        try:
            response = self.ai_client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
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
                    "data_type": "none",
                    "reasoning": f"JSON parsing failed: {e}"
                }
            
        except Exception as e:
            print(f"Error extracting data: {e}")
            return {
                "satisfies_goal": False,
                "data": None,
                "confidence": 0,
                "item_count": 0,
                "data_type": "none",
                "reasoning": f"AI extraction failed: {e}"
            }


class PageFetcherAgent(Agent):
    """Agent responsible for fetching web pages concurrently"""
    
    def __init__(self, name: str = "PageFetcher"):
        super().__init__(name)
    
    def execute(self, context: ExplorationContext, driver, url: str, **kwargs) -> Tuple[str, str, str]:
        """Fetch a single page and return URL, HTML, and visible text"""
        html = fetch_page_html(driver, url)
        if not html:
            return url, None, None
        
        text = extract_visible_text(html)
        if not text.strip():
            return url, html, None
        
        context.add_visited_url(url)
        return url, html, text


class BatchWebExplorer(Agent):
    """Main orchestrator that explores in guaranteed batches"""
    
    def __init__(self, ai_client=None):
        super().__init__("BatchExplorer", ai_client)
        self.url_scorer = URLScoringAgent()
        self.data_extractor = DataExtractionAgent()
        self.page_fetcher = PageFetcherAgent()
    
    def execute(self, context: ExplorationContext, driver=None, **kwargs) -> Dict[str, Any]:
        """Main exploration logic with guaranteed batch exploration"""
        
        print(f"\n{'='*60}")
        print(f"Starting BATCH exploration for goal: {context.goal}")
        print(f"Target site: {context.start_url}")
        print(f"Batch size: {context.batch_size} pages per batch")
        print(f"Min score threshold: {context.min_score_threshold}")
        print(f"{'='*60}\n")
        
        try:
            # Phase 1: Analyze first page
            first_result = self._analyze_first_page(context, driver)
            # Early exit if first page is high-confidence and satisfies goal
            if first_result.confidence >= 9.0 and first_result.satisfies_goal:
                print(f"✅ Early exit: first page has high-confidence ({first_result.confidence}) and satisfies goal. Skipping further exploration (Phases 2 and 3).")
                return self._build_final_result(first_result, context, ExplorationStrategy.FIRST_PAGE_SUFFICIENT)

            # Phase 2: Score all available links
            scored_links = self._score_all_links(context)

            # Phase 3: Explore in batches until satisfied or exhausted
            best_result = self._explore_in_batches(context, driver, scored_links, first_result)

            # Phase 4: Return best result
            strategy = self._determine_strategy(context)
            return self._build_final_result(best_result or first_result, context, strategy)

        except Exception as e:
            self.log(f"Exploration failed: {e}")
            return self._build_error_result(context, str(e))
    
    def _analyze_first_page(self, context: ExplorationContext, driver) -> ExplorationResult:
        """Analyze the first page"""
        print("PHASE 1: First Page Analysis")
        print("-" * 40)
        
        first_html = fetch_page_html(driver, context.start_url)
        if not first_html:
            raise Exception("Failed to fetch first page")

        first_text = extract_visible_text(first_html)
        links_with_context = extract_links_with_context(context.start_url, first_html)

        print(f"✓ Fetched first page: {len(first_text)} chars")
        print(f"✓ Found {len(links_with_context)} internal links")

        context.add_visited_url(context.start_url)
        context.links = links_with_context
        
        # Extract data from first page
        first_result = self.data_extractor.execute(context, first_text, context.start_url)
        context.update_best_result(first_result)
        
        print(f"first page data extraction:")
        print(f"  - Confidence: {first_result.confidence}/10")
        print(f"  - Satisfies goal: {first_result.satisfies_goal}")
        print(f"  - Data type: {first_result.data_type}")
        print(f"  - Reasoning: {first_result.reasoning}")
        
        if first_result.satisfies_goal and first_result.confidence >= 8 and first_result.confidence < 9.0:
            print("✅ first page claims to have high-confidence answer, but we'll explore more to verify!")
        else:
            print("📋 first page doesn't fully satisfy goal - exploration needed")
        
        return first_result
    
    def _score_all_links(self, context: ExplorationContext, batch_size: int = 10, exhaustive: bool = True) -> List[LinkScore]:
        """Score all available links in batches, grouping by semantic similarity to reduce LLM calls"""
        print("\nPHASE 2: Link Scoring (semantic grouping)")
        print("-" * 40)

        from promptly.services.agent_utils import group_similar_links

        scored_links = []
        unvisited_links = {url: ctx for url, ctx in context.links.items() if url not in context.visited_urls}
        print(f"Grouping {len(unvisited_links)} unvisited links by semantic similarity...")

        # Group similar links
        link_groups = group_similar_links(unvisited_links, similarity_threshold=0.5)
        print(f"Formed {len(link_groups)} link groups for scoring.")

        # Score only one representative per group
        group_scores = {}
        for group in link_groups:
            rep_url = group[0]
            rep_ctx = unvisited_links[rep_url]
            try:
                link_score = self.url_scorer.execute(context, rep_url, rep_ctx)
            except Exception as e:
                print(f"Error scoring representative URL {rep_url}: {e}")
                link_score = None
            # Assign score to all group members
            for url in group:
                if link_score:
                    # Use representative's context for all
                    scored_links.append(LinkScore(score=link_score.score, url=url, reasoning=link_score.reasoning + " (grouped)", context=unvisited_links[url]))
                else:
                    scored_links.append(LinkScore(score=0, url=url, reasoning="Scoring failed (grouped)", context=unvisited_links[url]))

        scored_links.sort(key=lambda x: x.score, reverse=True)

        print(f"\n📊 Link Scoring Results:")
        high_scoring = [link for link in scored_links if link.score >= context.min_score_threshold]
        medium_scoring = [link for link in scored_links if 5 <= link.score < context.min_score_threshold]
        low_scoring = [link for link in scored_links if link.score < 5]

        print(f"  - High priority (≥{context.min_score_threshold}): {len(high_scoring)} links")
        print(f"  - Medium priority (5-{context.min_score_threshold}): {len(medium_scoring)} links")
        print(f"  - Low priority (<5): {len(low_scoring)} links")

        print(f"\nTop scoring links:")
        for i, link in enumerate(scored_links[:10], 1):
            anchor_text = link.context.get('anchor_text', 'No text')[:40]
            print(f"  {i}. [{link.score:.1f}] {anchor_text} - {link.reasoning[:50]}")

        return scored_links
    
    def _explore_in_batches(self, context: ExplorationContext, driver, scored_links: List[LinkScore], first_result: ExplorationResult) -> ExplorationResult:
        """Explore links in batches until satisfied or exhausted"""
        print("\nPHASE 3: Batch Exploration")
        print("-" * 40)
        
        best_result = first_result
        pages_explored = 1  # first page
        batch_number = 1
        
        # Filter links by score threshold
        eligible_links = [link for link in scored_links if link.score >= context.min_score_threshold]
        
        # If no high-scoring links, take the top ones anyway
        if not eligible_links:
            print(f"⚠️ No links scored ≥{context.min_score_threshold}, taking top {context.batch_size} links")
            eligible_links = scored_links[:context.batch_size * 2]  # Take more in case some fail
        
        print(f"📋 {len(eligible_links)} eligible links to explore in batches of {context.batch_size}")
        
        while eligible_links and pages_explored < context.max_pages:
            # Determine batch size (handle edge cases)
            current_batch_size = min(context.batch_size, len(eligible_links), context.max_pages - pages_explored)
            batch_links = eligible_links[:current_batch_size]
            eligible_links = eligible_links[current_batch_size:]
            
            print(f"\n🔍 BATCH {batch_number}: Exploring {len(batch_links)} pages")
            print(f"   Pages explored so far: {pages_explored}/{context.max_pages}")
            
            # Show which pages we're exploring
            for i, link in enumerate(batch_links, 1):
                anchor_text = link.context.get('anchor_text', 'Unknown')[:40]
                print(f"   {i}. [{link.score:.1f}] {anchor_text}")
                print(f"      {link.url}")
            
            # Explore this batch
            batch_results = self._explore_batch(context, driver, batch_links)
            pages_explored += len(batch_links)
            
            # Check results from this batch
            batch_best = None
            for result in batch_results:
                if result:
                    context.update_best_result(result)
                    if not batch_best or result.confidence > batch_best.confidence:
                        batch_best = result
            
            # Update overall best
            if batch_best and (not best_result or batch_best.confidence > best_result.confidence):
                best_result = batch_best
            
            print(f"\n📊 Batch {batch_number} Results:")
            successful_results = [r for r in batch_results if r and r.satisfies_goal]
            if successful_results:
                print(f"   ✅ {len(successful_results)} pages satisfied the goal")
                best_in_batch = max(successful_results, key=lambda x: x.confidence)
                print(f"   🏆 Best result: {best_in_batch.confidence:.1f}/10 confidence from {best_in_batch.url}")
            else:
                print(f"   📋 No pages in this batch fully satisfied the goal")
            
            # Check if we should continue
            if self._should_stop_exploration(context, best_result):
                print(f"\n✅ Stopping exploration - found satisfactory result!")
                print(f"   Best confidence: {best_result.confidence:.1f}/10")
                break
            
            # Continue to next batch
            if eligible_links:
                print(f"\n⏭️  Current best confidence: {best_result.confidence:.1f}/10 - continuing to next batch...")
            
            batch_number += 1
        
        # Final summary
        print(f"\n📈 EXPLORATION SUMMARY:")
        print(f"   Total pages explored: {pages_explored}")
        print(f"   Batches completed: {batch_number}")
        print(f"   Best result confidence: {best_result.confidence:.1f}/10")
        print(f"   Goal satisfied: {best_result.satisfies_goal}")
        
        return best_result
    
    def _explore_batch(self, context: ExplorationContext, driver, batch_links: List[LinkScore]) -> List[ExplorationResult]:
        """Explore a batch of links sequentially"""
        batch_results = []
        completed = 0
        for link in batch_links:
            try:
                result = self._explore_single_page(context, driver, link)
                completed += 1
                anchor_text = link.context.get('anchor_text', 'Unknown')[:30]
                if result:
                    batch_results.append(result)
                    print(f"      ✓ [{completed}/{len(batch_links)}] {anchor_text}: {result.confidence:.1f}/10 conf, {result.data_type}")
                else:
                    print(f"      ❌ [{completed}/{len(batch_links)}] {anchor_text}: Failed to fetch")
            except Exception as e:
                completed += 1
                print(f"      ❌ [{completed}/{len(batch_links)}] Error exploring {link.url}: {e}")
        return batch_results
    
    def _explore_single_page(self, context: ExplorationContext, driver, link_score: LinkScore) -> Optional[ExplorationResult]:
        """Explore a single page and return extraction result"""
        url, html, text = self.page_fetcher.execute(context, driver, link_score.url)
        
        if not html or not text:
            return None
        
        # Extract data from this page
        result = self.data_extractor.execute(context, text, url)
        return result
    
    def _should_stop_exploration(self, context: ExplorationContext, best_result: ExplorationResult) -> bool:
        """Determine if we should stop exploring based on current results"""
        if not best_result:
            return False
        
        # Stop if we have a very high confidence result
        if best_result.satisfies_goal and best_result.confidence >= 9.0:
            return True
        
        return False
    
    def _determine_strategy(self, context: ExplorationContext) -> ExplorationStrategy:
        """Determine the exploration strategy used"""
        pages_explored = len(context.exploration_history)
        
        if pages_explored == 1:
            return ExplorationStrategy.FIRST_PAGE_SUFFICIENT
        elif pages_explored <= context.batch_size + 1:
            return ExplorationStrategy.BATCH_EXPLORATION
        elif pages_explored <= context.batch_size * 2 + 1:
            return ExplorationStrategy.MULTI_BATCH_EXPLORATION
        else:
            return ExplorationStrategy.EXHAUSTIVE_EXPLORATION
    
    def _build_final_result(self, result: ExplorationResult, context: ExplorationContext, strategy: ExplorationStrategy) -> Dict[str, Any]:
        """Build the final result dictionary"""
        print("\nPHASE 4: Result Compilation")
        print("-" * 40)
        
        if result and result.confidence >= 8:
            print(f"✅ Returning high-confidence result: {result.confidence}/10")
        elif result and result.satisfies_goal:
            print(f"✅ Returning satisfactory result: {result.confidence}/10")
        elif result and result.data:
            print(f"📋 Returning best available result: {result.confidence}/10")
        else:
            print("❌ Could not find satisfactory answer")
        
        final_result = {
            "data": result.data if result else None,
            "metadata": {
                "start_url": context.start_url,
                "successful_url": result.url if result else context.start_url,
                "pages_processed": len(context.exploration_history),
                "exploration_history": context.exploration_history,
                "confidence": result.confidence if result else 0,
                "item_count": result.item_count if result else 0,
                "strategy": strategy.value,
                "satisfies_goal": result.satisfies_goal if result else False,
                "batches_explored": max(1, (len(context.exploration_history) - 1) // context.batch_size),
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        # Show all results summary
        if len(context.all_results) > 1:
            print(f"\n📊 All Results Summary ({len(context.all_results)} pages analyzed):")
            sorted_results = sorted(context.all_results, key=lambda x: x.confidence, reverse=True)
            for i, res in enumerate(sorted_results[:5], 1):  # Top 5
                url_display = res.url.split('/')[-1] or 'home'
                print(f"   {i}. [{res.confidence:.1f}/10] {url_display} - {res.data_type}")
        
        # Agentic email logic
        self._handle_email_notification(context.goal, final_result)
        
        return final_result
    
    def _build_error_result(self, context: ExplorationContext, error: str) -> Dict[str, Any]:
        """Build error result"""
        result = {
            "error": error,
            "metadata": {
                "start_url": context.start_url,
                "pages_processed": len(context.exploration_history),
                "exploration_history": context.exploration_history,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        self._handle_email_notification(context.goal, result)
        return result
    
    def _handle_email_notification(self, goal: str, result: Dict[str, Any]):
        """Handle email notifications if needed"""
        try:
            email_decision = should_send_email_and_extract_address(goal, result)
            if email_decision["send_email"] and email_decision["email_address"]:
                print(f"\n📧 Sending result to {email_decision['email_address']} (reason: {email_decision['reasoning']})")
                try:
                    email_body = f"<pre>\n{json.dumps(result, indent=2)}\n</pre>"
                    send_email_via_arcade(email_decision["email_address"], email_body)
                    result["email_sent"] = True
                    result["email_message"] = f"Email sent to {email_decision['email_address']}"
                except Exception as e:
                    result["email_sent"] = False
                    result["email_message"] = f"Failed to send email: {str(e)}"
            else:
                result["email_sent"] = False
        except Exception as e:
            result["email_sent"] = False
            result["email_message"] = f"Email decision failed: {str(e)}"


# Factory function to create and configure the system
def create_batch_web_explorer(ai_client=None) -> BatchWebExplorer:
    """Create a configured batch web exploration system"""
    return BatchWebExplorer(ai_client)


# Main entry point function - keeps same interface as original
def smart_explore_site(driver, start_url: str, goal: str, max_pages=20):
    """
    Intelligent site exploration with guaranteed batch processing.
    Always explores at least one batch of high-scoring links.
    """
    context = ExplorationContext(
        start_url=start_url,
        goal=goal,
        max_pages=max_pages,
        confidence_threshold=8.0,
        batch_size=5,
        min_score_threshold=7.0,
        max_concurrent=5
    )
    
    explorer = create_batch_web_explorer(client)
    return explorer.execute(context, driver=driver)


# Enhanced entry point with batch configuration
def batch_explore_website(
    driver, 
    start_url: str, 
    goal: str, 
    max_pages: int = 20, 
    batch_size: int = 5,
    min_score_threshold: float = 7.0,
    confidence_threshold: float = 8.0,
    max_concurrent: int = 5,
    ai_client=None
) -> Dict[str, Any]:
    """
    Main function to explore a website in guaranteed batches
    
    Args:
        driver: Web driver instance
        start_url: Starting URL to explore
        goal: Description of what information to find
        max_pages: Maximum number of pages to explore
        batch_size: Number of pages to explore per batch (default: 5)
        min_score_threshold: Minimum link score to be eligible for exploration (default: 7.0)
        confidence_threshold: Confidence level considered satisfactory (default: 8.0)
        max_concurrent: Maximum number of concurrent page explorations within a batch
        ai_client: AI client for intelligent analysis (optional)
    
    Returns:
        Dictionary with exploration results and metadata
        
    Strategy:
        1. Always analyze first page first
        2. Score all available links
        3. Always explore at least one batch of highest-scoring links (≥7.0 score)
        4. Continue in batches until satisfied or max_pages reached
        5. Handle edge cases (fewer links available than batch_size)
    """
    context = ExplorationContext(
        start_url=start_url,
        goal=goal,
        max_pages=max_pages,
        confidence_threshold=confidence_threshold,
        batch_size=batch_size,
        min_score_threshold=min_score_threshold,
        max_concurrent=max_concurrent
    )
    
    explorer = create_batch_web_explorer(ai_client or client)
    return explorer.execute(context, driver=driver)
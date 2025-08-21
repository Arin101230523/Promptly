import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import requests, uuid
from groq import Groq  # Groq API client
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

tasks = {}
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class TaskCreate(BaseModel):
    url: str
    goal: str

@app.post("/create-task/")
def create_task(task: TaskCreate):
    task_id = str(uuid.uuid4())
    tasks[task_id] = {"url": task.url, "goal": task.goal}
    return {"task_id": task_id, "endpoint": f"/run-task/{task_id}"}

@app.get("/run-task/{task_id}")
def run_task(task_id: str):
    task = tasks[task_id]
    # Use Selenium to fetch fully rendered HTML
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(task["url"])
    html = driver.page_source
    driver.quit()
    # Extract all visible text from HTML using BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style"]):
        script.decompose()
    text = soup.get_text(separator="\n", strip=True)
    # Universal system prompt for any website and goal
    system_prompt = (
        "You are an advanced information extraction system. "
        "Your job is to extract information from any website based on the user's goal. "
        "You are given only the visible text content from the website, with all HTML markup, scripts, and styling removed. "
        "Analyze the text and context to determine what information the user wants. "
        "Return your answer as a valid JSON object, with keys that are descriptive and relevant to the goal. "
        "If you cannot find the requested information, return a JSON object with an 'error' key and a helpful message. "
        "Include a 'metadata' key with details about the extraction (e.g., url, goal, timestamp). "
        "Do not include any text outside the JSON object. "
        "If the goal is ambiguous, ask for clarification in the 'error' field. "
        "If the text is truncated, note this in the metadata. "
        "Example output: {\"data\": {...}, \"metadata\": {...}} or {\"error\": \"Reason\", \"metadata\": {...}}. "
    )
    prompt = (
        f"{system_prompt}\n\nURL: {task['url']}\nGoal: {task['goal']}\nTimestamp: {__import__('datetime').datetime.utcnow().isoformat()}\nVisible Text (truncated to 5000 chars):\n{text[:5000]}"
    )
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    # Try to parse the response as JSON
    import json
    content = response.choices[0].message.content
    try:
        result = json.loads(content)
    except Exception:
        result = {"error": "Model did not return valid JSON.", "raw": content}
    return result

from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from app.services.agent_service import smart_explore_site

router = APIRouter()

# In-memory task storage, replace with DB
tasks = {}

class TaskCreate(BaseModel):
    url: str
    goal: str

@router.post("/create-task/")
def create_task(task: TaskCreate):
    """Create a new crawling task."""
    task_id = str(uuid.uuid4())
    tasks[task_id] = {"url": task.url, "goal": task.goal, "status": "created"}
    return {"task_id": task_id, "endpoint": f"/run-task/{task_id}"}

@router.get("/run-task/{task_id}")
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

@router.get("/task-status/{task_id}")
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
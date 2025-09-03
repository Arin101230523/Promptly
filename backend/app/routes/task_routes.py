from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from app.services.agent_service import smart_explore_site
from app.clients.mongo_client import tasks_collection 

router = APIRouter()

class TaskCreate(BaseModel):
    url: str
    goal: str

class TaskUpdate(BaseModel):
    url: str | None = None
    goal: str | None = None

@router.post("/create-task/")
def create_task(task: TaskCreate):
    """Create a new crawling task."""
    task_id = str(uuid.uuid4())
    doc = {
        "_id": task_id,
        "url": task.url,
        "goal": task.goal,
        "status": "created",
        "timestamp": datetime.utcnow().isoformat()
    }
    tasks_collection.insert_one(doc)
    return {"task_id": task_id, "endpoint": f"/run-task/{task_id}"}

@router.get("/run-task/{task_id}")
def run_task(task_id: str):
    """Execute a crawling task."""
    task = tasks_collection.find_one({"_id": task_id})
    if not task:
        return {"error": "Task not found"}

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
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        tasks_collection.update_one({"_id": task_id}, {"$set": {"status": "running"}})

        result = smart_explore_site(driver, start_url, goal, max_pages=15)

        tasks_collection.update_one(
            {"_id": task_id},
            {"$set": {"status": "completed", "result": result}}
        )
        return result

    except Exception as e:
        error_result = {
            "error": f"Task execution failed: {str(e)}",
            "metadata": {
                "task_id": task_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        tasks_collection.update_one(
            {"_id": task_id},
            {"$set": {"status": "failed", "result": error_result}}
        )
        return error_result

    finally:
        if driver:
            driver.quit()

@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """Get the status of a task."""
    task = tasks_collection.find_one({"_id": task_id})
    if not task:
        return {"error": "Task not found"}

    return {
        "task_id": task_id,
        "status": task.get("status", "unknown"),
        "url": task["url"],
        "goal": task["goal"],
        "result": task.get("result", None)
    }

@router.patch("/update-task/{task_id}")
def update_task(task_id: str, update: TaskUpdate):
    """Update url or goal for a task. If completed, set status to 'modified'."""
    task = tasks_collection.find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] == "completed":
        # Set status to 'modified' and clear result
        update_fields = {k: v for k, v in update.dict().items() if v is not None}
        update_fields["status"] = "modified"
        update_fields["result"] = None
        tasks_collection.update_one({"_id": task_id}, {"$set": update_fields})
        return {"message": "Task updated. Status set to 'modified'. Result cleared."}
    else:
        update_fields = {k: v for k, v in update.dict().items() if v is not None}
        tasks_collection.update_one({"_id": task_id}, {"$set": update_fields})
        return {"message": "Task updated."}

@router.delete("/delete-task/{task_id}")
def delete_task(task_id: str):
    """Delete a task."""
    result = tasks_collection.delete_one({"_id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted."}
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
import random
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from promptly.services.agent_service import smart_explore_site
from promptly.clients.mongo_client import tasks_collection 
from promptly.services.agent_service import get_random_user_agent

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
    # Validate input
    try:
        if not task.url or not task.goal:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Missing required fields.",
                    "expected": {
                        "url": "str",
                        "goal": "str"
                    }
                }
            )
        task_id = str(uuid.uuid4())
        doc = {
            "_id": task_id,
            "url": task.url,
            "goal": task.goal,
            "status": "created",
            "created": datetime.utcnow().isoformat()
        }
        tasks_collection.insert_one(doc)
        return {"task_id": task_id, "endpoint": f"/run-task/{task_id}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[create_task] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.get("/run-task/{task_id}")
def run_task(task_id: str):
    """Execute a crawling task."""
    try:
        task = tasks_collection.find_one({"_id": task_id})
        if not task:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "Task not found.",
                    "expected": {
                        "task_id": "str (existing task id)"
                    }
                }
            )

        start_url = task["url"]
        goal = task["goal"]

        print(f"Running task {task_id}: {goal} on {start_url}")

        # Setup Chrome driver
        chrome_options = Options()
        
        # Basic headless options
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # Anti-detection measures
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-plugins")
        chrome_options.add_argument("--disable-images")
        
        # Performance optimizations
        chrome_options.add_argument("--memory-pressure-off")
        chrome_options.add_argument("--disable-background-timer-throttling")
        chrome_options.add_argument("--disable-renderer-backgrounding")
        chrome_options.add_argument("--disable-backgrounding-occluded-windows")
        chrome_options.add_argument("--enable-unsafe-swiftshader")
        chrome_options.add_argument("--disable-software-rasterizer")
        
        # Logging reduction
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        chrome_options.add_argument("--log-level=3")
        chrome_options.add_argument("--silent")
        
        # Random user agent
        chrome_options.add_argument(f"user-agent={get_random_user_agent()}")
        
        # Window size randomization
        width = random.randint(1024, 1920)
        height = random.randint(768, 1080)
        chrome_options.add_argument(f"--window-size={width},{height}")
        
        # Additional stealth options
        chrome_options.add_experimental_option("useAutomationExtension", False)
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])

        driver = None
        try:
            driver = webdriver.Chrome(options=chrome_options)
            tasks_collection.update_one({"_id": task_id}, {"$set": {"status": "running"}})

            result = smart_explore_site(driver, start_url, goal, max_pages=15)

            tasks_collection.update_one(
                {"_id": task_id},
                {"$set": {"status": "completed", "result": result, "last_ran": datetime.utcnow().isoformat()}}
            )
            return result

        except Exception as e:
            error_result = {
                "error": f"Task execution failed: {str(e)}",
                "metadata": {
                    "task_id": task_id,
                    "created": datetime.utcnow().isoformat()
                }
            }
            tasks_collection.update_one(
                {"_id": task_id},
                {"$set": {"status": "failed", "result": error_result}}
            )
            print(f"[run_task] Unexpected error: {e}")
            raise HTTPException(status_code=500, detail=error_result)
        finally:
            if driver:
                driver.quit()
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[run_task] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """Get the status of a task."""
    try:
        task = tasks_collection.find_one({"_id": task_id})
        if not task:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "Task not found.",
                    "expected": {
                        "task_id": "str (existing task id)"
                    }
                }
            )

        return {
            "task_id": task_id,
            "status": task.get("status", "unknown"),
            "url": task["url"],
            "goal": task["goal"],
            "result": task.get("result", None)
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[get_task_status] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.patch("/update-task/{task_id}")
def update_task(task_id: str, update: TaskUpdate):
    """Update url or goal for a task. If completed, set status to 'modified'."""
    try:
        task = tasks_collection.find_one({"_id": task_id})
        if not task:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "Task not found.",
                    "expected": {
                        "task_id": "str (existing task id)",
                        "body": {
                            "url": "str (optional)",
                            "goal": "str (optional)"
                        }
                    }
                }
            )
        if not update.url and not update.goal:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "No fields to update provided.",
                    "expected": {
                        "body": {
                            "url": "str (optional)",
                            "goal": "str (optional)"
                        }
                    }
                }
            )
        
        # Set status to 'modified' and clear result
        update_fields = {k: v for k, v in update.dict().items() if v is not None}
        update_fields["status"] = "modified"
        if update_fields.get("result") is not None:
            update_fields["result"] = None
        tasks_collection.update_one({"_id": task_id}, {"$set": update_fields})
        return {"message": "Task updated. Status set to 'modified'. Result cleared."}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[update_task] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.delete("/delete-task/{task_id}")
def delete_task(task_id: str):
    """Delete a task."""
    try:
        result = tasks_collection.delete_one({"_id": task_id})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "Task not found.",
                    "expected": {
                        "task_id": "str (existing task id)"
                    }
                }
            )
        return {"message": "Task deleted."}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[delete_task] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})
import uuid
from promptly.clients import api_client

task_id = None

def test_create_task():
    global task_id
    url = "https://example.com"
    goal = "Find the homepage title"
    result = api_client.create_task(url, goal)
    print(result)
    task_id = result.get("task_id")
    assert isinstance(result, dict)
    assert "task_id" in result, f"Expected 'task_id' in result, got {result}"
    assert "endpoint" in result, f"Expected 'endpoint' in result, got {result}"

def test_run_task():
    global task_id
    result = api_client.run_task(task_id)
    print(result)
    assert isinstance(result, dict)
    assert "error" in result, f"Expected 'error' in result, got {result}"

def test_get_task_status():
    global task_id
    result = api_client.get_task_status(task_id)
    print(result)
    assert isinstance(result, dict)
    assert "task_id" in result, f"Expected 'task_id' in result, got {result}"
    assert "status" in result, f"Expected 'status' in result, got {result}"
    assert "url" in result, f"Expected 'url' in result, got {result}"
    assert "goal" in result, f"Expected 'goal' in result, got {result}"

def test_update_task():
    global task_id
    result = api_client.update_task(task_id, url="https://example.com/updated")
    print(result)
    assert isinstance(result, dict)
    assert "message" in result, f"Expected 'message' in result, got {result}"
    assert "updated" in result["message"], f"Expected 'updated' in message, got {result['message']}"

def test_delete_task():
    global task_id
    result = api_client.delete_task(task_id)
    print(result)
    assert isinstance(result, dict)
    assert "message" in result, f"Expected 'message' in result, got {result}"
    assert "deleted" in result["message"], f"Expected 'deleted' in message, got {result['message']}"
    print(result)
    assert isinstance(result, dict)
    assert "error" in result or "message" in result

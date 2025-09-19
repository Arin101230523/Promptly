import os
import requests

from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

def create_task(url: str, goal: str):
    endpoint = f"{BACKEND_URL}/create-task/"
    payload = {"url": url, "goal": goal}
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def run_task(task_id: str):
    endpoint = f"{BACKEND_URL}/run-task/{task_id}"
    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def get_task_status(task_id: str):
    endpoint = f"{BACKEND_URL}/task-status/{task_id}"
    try:
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def update_task(task_id: str, url: str = None, goal: str = None):
    endpoint = f"{BACKEND_URL}/update-task/{task_id}"
    payload = {}
    if url is not None:
        payload["url"] = url
    if goal is not None:
        payload["goal"] = goal
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.patch(endpoint, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def delete_task(task_id: str):
    endpoint = f"{BACKEND_URL}/delete-task/{task_id}"
    try:
        response = requests.delete(endpoint)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}
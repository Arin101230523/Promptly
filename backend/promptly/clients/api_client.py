import requests

class PromptlyClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')

    def create_task(self, url: str, goal: str):
        """
        Create a new crawling task.
        Returns: dict with task_id and endpoint
        """
        payload = {'url': url, 'goal': goal}
        response = requests.post(f"{self.base_url}/create-task/", json=payload)
        response.raise_for_status()
        return response.json()

    def run_task(self, task_id: str):
        """
        Execute a crawling task.
        Returns: dict with result
        """
        response = requests.get(f"{self.base_url}/run-task/{task_id}")
        response.raise_for_status()
        return response.json()

    def get_task_status(self, task_id: str):
        """
        Get the status of a task.
        Returns: dict with status and result
        """
        response = requests.get(f"{self.base_url}/task-status/{task_id}")
        response.raise_for_status()
        return response.json()

    def update_task(self, task_id: str, url: str = None, goal: str = None):
        """
        Update url or goal for a task. If completed, set status to 'modified'.
        Returns: dict with update message
        """
        payload = {}
        if url is not None:
            payload['url'] = url
        if goal is not None:
            payload['goal'] = goal
        response = requests.patch(f"{self.base_url}/update-task/{task_id}", json=payload)
        response.raise_for_status()
        return response.json()

    def delete_task(self, task_id: str):
        """
        Delete a task.
        Returns: dict with delete message
        """
        response = requests.delete(f"{self.base_url}/delete-task/{task_id}")
        response.raise_for_status()
        return response.json()
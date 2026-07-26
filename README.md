# Promptly

Promptly is a multi-agent backend system for **goal-directed website exploration** and **automated web workflow execution**. It combines semantic clustering, batch-based traversal, and LLM-based confidence gating to intelligently navigate websites toward a defined goal, and exposes dynamically generated REST endpoints for running containerized web automation tasks asynchronously, including agentic email delivery of results.

## Features

### Multi-Agent Website Exploration
- Uses **SentenceTransformer embeddings** and **cosine similarity clustering** to group and prioritize candidate links before traversal.
- **Batch-based traversal** explores multiple promising paths in parallel rather than a single greedy path, improving both speed and coverage.
- **LLM-based confidence gating** evaluates each traversal step against the stated goal, deciding whether to continue down a path, backtrack, or terminate, enabling adaptive, goal-directed exploration instead of blind crawling.

### Dynamic Task Execution System
- Generates a **REST API endpoint per task**, so each exploration/automation job gets its own callable interface.
- Executes **containerized web automation workflows** asynchronously, isolating each task's browser/runtime environment.
- Supports **agentic email delivery** of results — once a task completes, an agent composes and sends a summary/report via email automatically.

## Tech Stack

- **Python**
- **FastAPI** — dynamic REST endpoint generation
- **Uvicorn** — ASGI server
- **Groq** — LLM inference (confidence gating, agentic email composition)
- **Pydantic Settings** — configuration management
- **BeautifulSoup4** — HTML parsing
- **Selenium** — browser automation
- **python-dotenv** — environment variable loading
- **PyMongo** — MongoDB client
- **ArcadePy** — agentic tool execution (e.g. email delivery)
- **SentenceTransformers** — embedding generation for link/content similarity
- **scikit-learn** — cosine similarity & clustering
- **Requests** — HTTP client
- **Docker & Docker Compose** — containerized, per-task execution isolation
- **Pytest** — testing

### Dependencies

```
fastapi==0.111.0
requests
uvicorn==0.30.1
groq==0.30.0
pydantic-settings==2.3.0
beautifulsoup4
selenium
python-dotenv
pymongo[srv]
arcadepy
sentence-transformers
scikit-learn
pytest
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- An LLM API key (e.g. `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`)
- SMTP credentials (or email API key) for result delivery

### Running with Docker Compose

Build and start all services (API, workers, and any supporting infra):

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f
```

Stop everything:

```bash
docker compose down
```

Once running, the API will be available at:

```
http://localhost:8000
```

(Adjust the port to match your `docker-compose.yml`.)

## Usage

### 1. Submit an exploration task

Each new task dynamically provisions its own endpoint. A typical flow:

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{
        "goal": "Find pricing information for enterprise plans",
        "start_url": "https://example.com",
        "email_to": "you@example.com",
        "max_depth": 5,
        "batch_size": 10
      }'
```

Response:

```json
{
  "task_id": "abc123",
  "endpoint": "/tasks/abc123",
  "status": "queued"
}
```

### 2. Poll or check task status

```bash
curl http://localhost:8000/tasks/abc123
```

### 3. Receive results

Once the task completes, the agentic email module automatically composes and sends a summary of findings to the specified recipient. Results can also be retrieved directly from the task endpoint.
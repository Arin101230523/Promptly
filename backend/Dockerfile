FROM python:3.11-slim

WORKDIR /backend
COPY . /backend

# Install Chromium and ChromeDriver
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-chromedriver \
    curl && \
    apt-get clean

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "promptly.main:app", "--host", "0.0.0.0", "--port", "8000"]
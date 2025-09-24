FROM python:3.11-slim

WORKDIR /backend
COPY . /backend

# installing google-chrome-stable via curl
RUN apt-get update && apt-get install -y curl && \
    curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "promptly.main:app", "--host", "0.0.0.0", "--port", "8000"]
from pymongo import MongoClient
import os

client = MongoClient(f"mongodb+srv://{os.getenv('MONGO_USERNAME')}:{os.getenv('MONGO_PASSWORD')}@cluster0.c4lqr1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Promptly"]
tasks_collection = db["tasks"]
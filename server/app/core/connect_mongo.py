# import pymongo
from pymongo import MongoClient
from .config import db_url

def mongo_connect():
    try:
        client = MongoClient(db_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("MongoDB connection successful")
        db_name = client['ShuffleRoyal']
        return db_name
    except Exception as e:
        print("MongoDB connection failed : ", e)
        return None        
# import pymongo
from mongoengine import connect
from .config import db_url, db_name

def mongo_connect():
    try:
        connect(
            db=db_name,
            host=db_url,
            alias="default"
        )
        print("MongoDB is connected")
    except Exception as e:
        print("MongoDB connection failed : ", e)
        return None
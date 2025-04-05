from dotenv import load_dotenv
import os
load_dotenv('../../.env')

host = os.getenv("REDIS_HOST")
username = os.getenv("REDIS_USERNAME")
password = os.getenv("REDIS_PASSWORD")
port = os.getenv("REDIS_PORT")

from dotenv import load_dotenv
import os
load_dotenv('../../.env')

# Loading redis environment variables
host = os.getenv("REDIS_HOST")
username = os.getenv("REDIS_USERNAME")
password = os.getenv("REDIS_PASSWORD")

# Loading mongodb environment variables
port = os.getenv("REDIS_PORT")
db_url = os.getenv("MONGODB")

# Loading google oauth environment variables
client_id = os.getenv("GOOGLE_CLIENT_ID")
client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
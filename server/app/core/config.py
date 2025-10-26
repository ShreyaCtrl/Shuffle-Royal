from dotenv import load_dotenv
import os
load_dotenv('../../.env')

# Loading redis environment variables
host = os.environ.get("REDIS_HOST")
username = os.getenv("REDIS_USERNAME")
password = os.getenv("REDIS_PASSWORD")
port = os.getenv("REDIS_PORT")
redis_uri = f'redis://{username}:{password}@{host}:{15034}/0'
print(redis_uri, '-------------------------config.py')

# Loading mongodb environment variables
db_url = os.getenv("MONGODB")
db_name = os.getenv("DB_NAME")

# Loading google oauth environment variables
client_id = os.getenv("GOOGLE_CLIENT_ID")
client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

# Loading cloudinary environment
cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
api_key = os.getenv('CLOUDINARY_API_KEY')
api_secret = os.getenv('CLOUDINARY_API_SECRET')

# loading jwt environment variables
private_key = os.getenv("OPENSSH_PRIVATE_KEY")
public_key = os.getenv("OPENSSH_PUBLIC_KEY")
jwt_algorithm = os.getenv("OPENSSH_JWT_ALGORITHM")
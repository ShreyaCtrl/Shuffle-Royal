import redis
from urllib.parse import urlparse
from app.core.config import host, password, username, port

redis_client = None

def redis_connect():
    global redis_client
    if redis_client:
        return redis_client

    try:

        print(host, port, username, password)
        redis_client = redis.Redis(
            host=host,
            port=port,
            decode_responses=True,
            username=username,
            password=password,
        )
        redis_client.ping()
        print("✅ Connected to Redis")
        print(redis_client)
        return redis_client
    except Exception as e:
        print("❌ Redis connection failed:", e)
        return None
# success = r.set('foo', 'bar')
#
# result = r.get('foo')
# print(result)
# >>> bar

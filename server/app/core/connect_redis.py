import redis
from app.core.config import host, password, username, port

def redis_connect():
    try:
        print(host, port, username, password)
        redis_client = redis.Redis(
            host=host,
            port=15034,
            decode_responses=True,
            username=username,
            password=password,
        )
        redis_client.ping()
        print("✅ Connected to Redis")
        return redis_client
    except Exception as e:
        print("❌ Redis connection failed:", e)
        return None
# success = r.set('foo', 'bar')
#
# result = r.get('foo')
# print(result)
# >>> bar

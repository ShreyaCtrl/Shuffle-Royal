import redis
from .config import host, password, username, port

def redis_connect():
    try:
        r = redis.Redis(
            host=host,
            port=port,
            decode_responses=True,
            username=username,
            password=password,
        )
        return r
    except Exception as e:
        print("Exception : ", e)
# success = r.set('foo', 'bar')
#
# result = r.get('foo')
# print(result)
# >>> bar

import random, string
from app.core.connect_redis import redis_connect

redis_client = redis_connect()
def generate_room_code(length=4):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))

def create_room():
    room_code = generate_room_code()
    redis_client.sadd(f"room:{room_code}:players", "")
    return room_code

def add_player_to_room(room_code, username):
    redis_client.sadd(f"room:{room_code}:players", username)

def remove_player_from_room(room_code, username):
    redis_client.srem(f"room:{room_code}:players", username)

def get_players_in_room(room_code):
    return list(redis_client.smembers(f"room:{room_code}:players"))

def clear_room(room_code):
    redis_client.delete(f"room:{room_code}:players")
    redis_client.delete(f"room:{room_code}:predictions")
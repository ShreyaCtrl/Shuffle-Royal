import random, string
from typing import List, Dict, Union
from app.core.connect_redis import redis_connect
#
redis_client = redis_connect()
def generate_room_code(length=4):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))
#
def create_room():
    room_code = generate_room_code()
    redis_client.sadd(f"room:{room_code}:players", "")
    return room_code
#
# def add_player_to_room(room_code, username):
#     redis_client.sadd(f"room:{room_code}:players", username)
#
# def remove_player_from_room(room_code, username):
#     redis_client.srem(f"room:{room_code}:players", username)
#
# def get_players_in_room(room_code):
#     return list(redis_client.smembers(f"room:{room_code}:players"))
#
# def clear_room(room_code):
#     redis_client.delete(f"room:{room_code}:players")
#     redis_client.delete(f"room:{room_code}:predictions")

# - add_player_to_room(game_id, player_id)
def add_player_to_room(game_id: str, player_id: str) -> None:
    redis_client.sadd(f"game:{game_id}:players", player_id)

# - get_connected_players(game_id)
def get_connected_players(game_id: str) -> List[str]:
    return list(redis_client.smembers(f"game:{game_id}:players"))

# - set_game_status(game_id, status)
def set_game_status(game_id: str, status: str) -> None:
    redis_client.set(f"game:{game_id}:status", status)

# - get_game_status(game_id)
def get_game_status(game_id: str) -> Union[str, None]:
    return redis_client.get(f"game:{game_id}:status")

# - set_predictions_revealed(game_id)
def set_predictions_revealed(game_id: str, timestamp: str = "true") -> None:
    redis_client.set(f"game:{game_id}:predictions_revealed", timestamp)

# - are_all_predictions_submitted(game_id)
def are_all_predictions_submitted(game_id: str) -> bool:
    players = get_connected_players(game_id)
    for player_id in players:
        key = f"game:{game_id}:player:{player_id}"
        if not redis_client.hexists(key, "prediction"):
            return False
    return True

# - get_game_metadata(game_id)
def get_game_metadata(game_id: str) -> Dict[str, Union[str, List[str], None]]:
    return {
        "status": get_game_status(game_id),
        "players": get_connected_players(game_id),
        "predictions_revealed": redis_client.get(f"game:{game_id}:predictions_revealed")
    }


# - expire_game_keys(game_id, ttl_seconds)
def expire_game_keys(game_id: str, ttl_seconds: int) -> None:
    keys = redis_client.keys(f"game:{game_id}:*")
    for key in keys:
        redis_client.expire(key, ttl_seconds)

# - get_prediction_status(game_id)
def get_prediction_status(game_id: str) -> Dict[str, bool]:
    status_map = {}
    players = get_connected_players(game_id)
    for player_id in players:
        key = f"game:{game_id}:player:{player_id}"
        status_map[player_id] = redis_client.hexists(key, "prediction")
    return status_map

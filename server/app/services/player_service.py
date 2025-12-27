from typing import Dict, List, Union
from app.core.connect_redis import redis_connect

redis_client = redis_connect()

def save_prediction(room_code, username, prediction):
    redis_client.hset(f"room:{room_code}:predictions", username, prediction)

def all_predictions_submitted(room_code):
    total_players = redis_client.scard(f"room:{room_code}:players")
    total_predictions = redis_client.hlen(f"room:{room_code}:predictions")
    return total_predictions == total_players

def get_all_predictions(room_code):
    return redis_client.hgetall(f"room:{room_code}:predictions")

# initialize_player_data(game_id, player_id)
def initialize_player_data(game_id: str, player_id: str) -> None:
    key = f"game:{game_id}:player:{player_id}"
    if not redis_client.exists(key):
        redis_client.hset(key, mapping={
            "username": player_id,  # Replace with actual username if available
            "prediction": "",
            "hands_won": 0,
            "score": 0,
            "timestamp": ""
        })

# update_player_prediction(game_id, player_id, prediction)
def update_player_prediction(game_id: str, player_id: str, prediction: int) -> None:
    key = f"game:{game_id}:player:{player_id}"
    if not redis_client.exists(key):
        initialize_player_data(game_id, player_id)
    redis_client.hset(key, "prediction", prediction)

# get_player_data(game_id, player_id)
def get_player_data(game_id: str, player_id: str) -> Dict[str, Union[str, int]]:
    key = f"game:{game_id}:player:{player_id}"
    return redis_client.hgetall(key)

# get_all_players_data(game_id)
def get_all_players_data(game_id: str) -> List[Dict[str, Union[str, int]]]:
    players = redis_client.smembers(f"game:{game_id}:players")
    return [get_player_data(game_id, pid) for pid in players]

# update_player_score(game_id, player_id, score)
def update_player_score(game_id: str, player_id: str, score: int) -> None:
    key = f"game:{game_id}:player:{player_id}"
    if not redis_client.exists(key):
        initialize_player_data(game_id, player_id)
    redis_client.hset(key, "score", score)

# update_player_hands_won(game_id, player_id, hands_won)
def update_player_hands_won(game_id: str, player_id: str, hands_won: int) -> None:
    key = f"game:{game_id}:player:{player_id}"
    if not redis_client.exists(key):
        initialize_player_data(game_id, player_id)
    redis_client.hset(key, "hands_won", hands_won)

# delete_player_data(game_id, player_id)
def delete_player_data(game_id: str, player_id: str) -> None:
    key = f"game:{game_id}:player:{player_id}"
    redis_client.delete(key)

# get_all_predictions(game_id)
def get_all_predictions(game_id: str) -> Dict[str, Union[int, str]]:
    predictions = {}
    players = redis_client.smembers(f"game:{game_id}:players")
    for pid in players:
        key = f"game:{game_id}:player:{pid}"
        prediction = redis_client.hget(key, "prediction")
        predictions[pid] = prediction
    return predictions

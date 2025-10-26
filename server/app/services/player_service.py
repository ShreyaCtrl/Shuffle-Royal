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

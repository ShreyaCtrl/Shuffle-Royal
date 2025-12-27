from flask import Blueprint, jsonify
from app.services.room_service import create_room
from flask_socketio import join_room, emit
from app.services.player_service import (
    save_prediction,
    all_predictions_submitted,
    get_all_predictions,
)
from app.core.connect_redis import redis_connect

game_bp = Blueprint("game", __name__)
redis_client = redis_connect()

@game_bp.route("/create-room", methods=["POST"])
def create_room_route():
    room_code = create_room()
    return jsonify({"roomCode": room_code})

def register_game_routes(socketio):
    @socketio.on("join_room")
    def handle_join_room(data):
        username = data.get("username")
        room = data.get("room")

        if not username or not room:
            emit("error", {"message": "Missing username or room"})
            return

        # Add player to Redis room set
        redis_client.sadd(f"room:{room}:players", username)
        join_room(room)

        # Notify all players in the room about the update
        players = list(redis_client.smembers(f"room:{room}:players"))
        emit("room_update", {"room": room, "players": players}, room=room)

    @socketio.on("submit_prediction")
    def handle_prediction(data):
        username = data.get("username")
        room = data.get("room")
        prediction = data.get("prediction")

        if not username or not room or prediction is None:
            emit("error", {"message": "Missing prediction data"})
            return

        save_prediction(room, username, prediction)
        print(f"🧠 {username} predicted {prediction} in room {room}")

        # Check if all players have submitted their predictions
        if all_predictions_submitted(room):
            all_preds = get_all_predictions(room)
            emit("reveal_predictions", all_preds, room=room)
        else:
            total = redis_client.hlen(f"room:{room}:predictions")
            emit("prediction_update", {"submitted": total}, room=room)

    @socketio.on("disconnect")
    def handle_disconnect():
        print("❌ A player disconnected.")
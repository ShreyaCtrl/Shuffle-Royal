from flask_socketio import join_room, leave_room, emit
from app.services.room_service import add_player_to_room, get_players_in_room, remove_player_from_room
from app.services.player_service import save_prediction, all_predictions_submitted, get_all_predictions

def register_game_events(socketio):

    @socketio.on("join_room")
    def on_join(data):
        username = data.get("username")
        room_code = data.get("room")

        join_room(room_code)
        add_player_to_room(room_code, username)
        players = get_players_in_room(room_code)
        emit("room_update", {"players": players}, room=room_code)
        print(f"👤 {username} joined room {room_code}")

    @socketio.on("submit_prediction")
    def on_prediction(data):
        room_code = data["room"]
        username = data["username"]
        prediction = data["prediction"]

        save_prediction(room_code, username, prediction)

        if all_predictions_submitted(room_code):
            all_preds = get_all_predictions(room_code)
            emit("reveal_predictions", all_preds, room=room_code)
        else:
            emit("prediction_received", {"username": username}, room=room_code)

    @socketio.on("leave_room")
    def on_leave(data):
        username = data.get("username")
        room_code = data.get("room")

        remove_player_from_room(room_code, username)
        leave_room(room_code)
        players = get_players_in_room(room_code)
        emit("room_update", {"players": players}, room=room_code)

    @socketio.on("disconnect")
    def on_disconnect():
        print("🔌 A user disconnected")

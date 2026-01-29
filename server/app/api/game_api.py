from flask import Blueprint, jsonify, request
# from app.services.room_service import create_room
from app.models import RoomMember
from app.services.player_service import (
    save_prediction,
    all_predictions_submitted,
    get_all_predictions,
)
from app.core.connect_redis import redis_connect

game_bp = Blueprint("game", __name__)
redis_client = redis_connect()

# 1. create-room : admin to create room, give name to it and store it in redis at the moment
# 2. join-room : allow people to add code if correct allow them to connect to room, store it in redis, if room present in db, then allow only the existing members
# 3. show-other-room-members-status - show a waiting page showing if the other room members have joined or not.
# 4. prediction-page - page where users can see the cards they have got and predict based on it.
# 5. prediction-status - shown of the prediction page shows if other players have predicted their hands, show everyone's prediction only when all are done
# 6. drop-cards -
#
# @game_bp.route("/create-room", methods=["POST"])
# def create_room_route():
#     data = request.get_json()
#
#     room_name = data.get("name")
#     # In a real app, get admin_id from current_user or session
#     admin_id = data.get("admin_id")
#
#     if not room_name or not admin_id:
#         return jsonify({"error": "Missing room name or admin ID"}), 400
#     room_code, db_id = create_room(room_name, admin_id)
#     print(room_code, db_id)
#
#     return jsonify({
#         "message": "Room created successfully",
#         "roomCode": room_code,
#         "roomId": db_id
#     }), 201


  # Your SQLAlchemy model for room_members


# @game_bp.route("/join-room", methods=["POST"])
# def join_room_route():
#     data = request.get_json()
#     room_code = data.get("room_code")
#     user_id = data.get("user_id")
#
#     # 1. Convert Room Code to DB Room ID
#     db_id = redis_client.get(f"room_code:{room_code}")
#
#     if not db_id:
#         return jsonify({"error": "Invalid room code"}), 404
#
#     # Convert bytes to string if necessary (Redis returns bytes)
#     db_id = db_id.decode('utf-8') if isinstance(db_id, bytes) else db_id
#
#     # 2. Check if Room is Active in Redis
#     metadata_key = f"room:{db_id}:metadata"
#     room_status = redis_client.hget(metadata_key, "status")
#
#     if not room_status or room_status.decode('utf-8') != "active":
#         return jsonify({"error": "Room is no longer active"}), 400
#
#     # 3. Database Check: Is this a returning room?
#     # Check if the room has any existing members in Postgres
#     existing_member = RoomMember.query.filter_by(room_id=db_id, user_id=user_id).first()
#
#     # If the room is already established in DB, but user isn't in it, block them
#     # (Optional: Only apply this if the game has already started once)
#     room_has_history = RoomMember.query.filter_by(room_id=db_id).first()
#     if room_has_history and not existing_member:
#         return jsonify({"error": "You are not a member of this private session"}), 403
#
#     # 4. Add to Redis Presence Set
#     # This tracks who is currently "online" in the room right now
#     player_key = f"room:{db_id}:players"
#     redis_client.sadd(player_key, user_id)
#
#     # 5. Fetch all current players to return to the UI
#     current_players = [p.decode('utf-8') for p in redis_client.smembers(player_key)]
#
#     return jsonify({
#         "message": "Joined successfully",
#         "roomId": db_id,
#         "players": current_players
#     }), 200


# def register_game_routes(socketio):
#     @socketio.on("join_room")
#     def handle_join_room(data):
#         username = data.get("username")
#         room = data.get("room")
#
#         if not username or not room:
#             emit("error", {"message": "Missing username or room"})
#             return
#
#         # Add player to Redis room set
#         redis_client.sadd(f"room:{room}:players", username)
#         join_room(room)
#
#         # Notify all players in the room about the update
#         players = list(redis_client.smembers(f"room:{room}:players"))
#         emit("room_update", {"room": room, "players": players}, room=room)
#
#     @socketio.on("submit_prediction")
#     def handle_prediction(data):
#         username = data.get("username")
#         room = data.get("room")
#         prediction = data.get("prediction")
#
#         if not username or not room or prediction is None:
#             emit("error", {"message": "Missing prediction data"})
#             return
#
#         save_prediction(room, username, prediction)
#         print(f"🧠 {username} predicted {prediction} in room {room}")
#
#         # Check if all players have submitted their predictions
#         if all_predictions_submitted(room):
#             all_preds = get_all_predictions(room)
#             emit("reveal_predictions", all_preds, room=room)
#         else:
#             total = redis_client.hlen(f"room:{room}:predictions")
#             emit("prediction_update", {"submitted": total}, room=room)
#
#     @socketio.on("disconnect")
#     def handle_disconnect():
#         print("❌ A player disconnected.")
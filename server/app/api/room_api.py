from flask import Blueprint, request, jsonify
from app.services.room_service import create_room_for_existing_leaderboard, handle_player_join_event
from app.models import RoomMember, User
from app.core.connect_redis import redis_client

room_bp = Blueprint("room", __name__)


@room_bp.route("/create-room-existing-leaderboard", methods=["POST"])
def sync_existing_leaderboard_route():
    print(request)
    data = request.get_json()

    # 1. Get required IDs from the request
    room_id = data.get("room_id")
    admin_id = data.get("admin_id")

    if not room_id or not admin_id:
        return jsonify({"error": "Missing room_id or admin_id"}), 400

    try:
        # 2. Call your logic function to sync SQL to Redis
        # This populates metadata, player sets, and the sorted set leaderboard
        sync_result = create_room_for_existing_leaderboard(admin_id=admin_id, room_id=room_id)

        # Handle cases where the function might return an error tuple (e.g., 404)
        if isinstance(sync_result, tuple):
            return jsonify(sync_result[0]), sync_result[1]

        # 3. Return the new room_code so the admin can share it
        return jsonify({
            "message": "Redis session initialized from existing leaderboard",
            "data": sync_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @room_bp.route("/join-existing-room", methods=["POST"])
# def join_existing_room():
#     data = request.get_json()
#     room_code = data.get("room_code")
#     user_id = data.get("user_id")
#
#     if not room_code or not user_id:
#         return jsonify({"error": "Missing room code or user ID"}), 400
#
#     # 1. Lookup the DB Room ID from the Redis code pointer
#     # This uses the 'room_code:{code}' -> 'db_id' mapping we created
#     db_room_id = redis_client.get(f"room_code:{room_code}")
#
#     if not db_room_id:
#         return jsonify({"error": "Invalid or expired room code"}), 404
#
#     db_room_id = db_room_id.decode('utf-8') if isinstance(db_room_id, bytes) else db_room_id
#
#     # 2. Check if the user is an authorized member in PostgreSQL
#     # Based on your schema, we check the room_members table
#     is_member = RoomMember.query.filter_by(room_id=db_room_id, user_id=user_id).first()
#
#     if not is_member:
#         return jsonify({"error": "User is not a member of this room"}), 403
#
#     # 3. Ensure Redis state is active (Hydrate if necessary)
#     # If the server restarted, metadata might be gone but the code pointer exists
#     metadata_key = f"room:{db_room_id}:metadata"
#     if not redis_client.exists(metadata_key):
#         # We use the function we just corrected to rebuild the Redis state from DB
#         return jsonify({"error": "The room does not exist"}), 404
#
#     # 4. Update Presence: Mark user as 'active' in Redis
#     # Add to the Set of online players
#     redis_client.sadd(f"room:{db_room_id}:players", user_id)
#
#     # Update individual player status hash
#     redis_client.hset(f"player:{user_id}:data", "status", "active")
#
#     # 5. Get current leaderboard standing from Redis Sorted Set
#     # This retrieves members ordered by score
#     leaderboard = redis_client.zrevrange(f"game:{db_room_id}:leaderboard", 0, -1, withscores=True)
#
#     return jsonify({
#         "message": "Successfully joined existing session",
#         "room_id": db_room_id,
#         "current_leaderboard": [{"user_id": x[0].decode(), "score": x[1]} for x in leaderboard]
#     }), 200


# Assuming these models exist


@room_bp.route("/join-room", methods=["POST"])
def join_room_route():
    print(request)
    data = request.get_json()
    # Match the camelCase from React or standardize both
    room_code = data.get("roomCode")
    user_id = data.get("userId")

    if not room_code or not user_id:
        return jsonify({"status": "error", "message": "Missing room code or user ID"}), 400

    db_room_id = redis_client.get(f"room_code:{room_code}")
    if not db_room_id:
        return jsonify({"status": "error", "message": "Invalid room code"}), 404

    db_room_id = db_room_id.decode('utf-8') if isinstance(db_room_id, bytes) else db_room_id

    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    join_data = handle_player_join_event(db_room_id, user_id, user.username)

    leaderboard_key = f"game:{db_room_id}:leaderboard"
    if redis_client.zscore(leaderboard_key, user_id) is None:
        redis_client.zadd(leaderboard_key, {user_id: 0})

    # Return "status": "success" to match your React if condition
    return jsonify({
        "status": "success",
        "message": "Joined successfully",
        "roomCode": room_code,
        "roomId": db_room_id,
        "room_details": join_data
    }), 200
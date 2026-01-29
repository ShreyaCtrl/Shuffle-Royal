from flask import Blueprint, jsonify, session
from app.models import User, RoomMember, Room  # Adjust based on your file structure
from app.extensions import db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile/me', methods=['GET'])
def get_current_profile():
    # 1. Get the session dictionary

    user_session = session.get("user")
    print(user_session)
    # 2. Check if the user is logged in
    if not user_session or "id" not in user_session:
        return jsonify({
            "status": "error",
            "message": "Unauthorized: Please log in"
        }), 401

    # 3. Use the ID from the dictionary to query the database
    # Note: Ensure the ID is a string or UUID as per your DB column type
    user_id = user_session["id"]
    user = User.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    # 4. Return the response to the React frontend
    return jsonify({
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "avatar": user.avatar_url,
            "password": user.password_hash,
            "games_played": user.games_played,
            "games_won": user.games_won
        }
    }), 200

@profile_bp.route('/rooms/<uuid:room_id>/leaderboard', methods=['GET'])
def get_room_leaderboard(room_id):
    """
    Fetches the leaderboard for a specific room including
    usernames, overall scores, and ranks.
    """
    try:
        # Querying room_members joined with users to get display names
        leaderboard_query = db.session.query(
            User.username,
            RoomMember.overall_room_score,
            RoomMember.rank
        ).join(User, RoomMember.user_id == User.user_id)\
         .filter(RoomMember.room_id == room_id)\
         .order_by(RoomMember.rank.asc())\
         .all()

        if not leaderboard_query:
            return jsonify({"error": "Room not found or has no members"}), 404

        # Formatting data for the frontend
        leaderboard_data = [
            {
                "username": member.username,
                "score": member.overall_room_score,
                "rank": member.rank
            }
            for member in leaderboard_query
        ]

        return jsonify({
            "room_id": str(room_id),
            "leaderboard": leaderboard_data
        }), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


# @profile_bp.route('/my-rooms/leaderboards', methods=['GET'])
# def get_all_my_room_leaderboards():
#     """
#     Fetches leaderboards for every room the logged-in user is a member of.
#     """
#     try:
#         current_user_id = session.get("user_id")  # Or your auth logic
#
#         # 1. Find all Room IDs the user belongs to
#         user_rooms = db.session.query(RoomMember.room_id, Room.name).filter_by(user_id=current_user_id).all()
#         rooms = [(r.room_id, r.name) for r in user_rooms]
#
#         if not rooms:
#             return jsonify({"status": "success", "rooms": []}), 200
#
#         # 2. Fetch all members for those specific rooms
#         all_members = db.session.query(
#             RoomMember.room_id,
#             User.username,
#             RoomMember.overall_room_score,
#             RoomMember.rank
#         ).join(User, RoomMember.user_id == User.user_id) \
#             .filter(RoomMember.room_id.in_(rooms)) \
#             .order_by(RoomMember.room_id, RoomMember.rank.asc()) \
#             .all()
#
#         # 3. Group the flat list into a dictionary structured by room_id
#         rooms_data = {}
#         for member in all_members:
#             rid = str(member.room_id)
#             if rid not in rooms_data:
#                 rooms_data[rid] = []
#
#             rooms_data[rid].append({
#                 "username": member.username,
#                 "score": member.overall_room_score,
#                 "rank": member.rank
#             })
#
#         return jsonify({
#             "status": "success",
#             "rooms": rooms_data
#         }), 200
#
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500


@profile_bp.route('/my-rooms/leaderboards', methods=['GET'])
def get_all_my_room_leaderboards():
    try:
        current_user_id = session.get("user")#["id"]
        print(current_user_id['id'])
        # 1. Get Room IDs AND Names by joining with the Room table
        user_rooms = db.session.query(RoomMember.room_id, Room.name)\
            .join(Room, RoomMember.room_id == Room.room_id)\
            .filter(RoomMember.user_id == current_user_id['id']).all()
        print(user_rooms)
        if not user_rooms:
            return jsonify({"status": "success", "rooms": {}}), 200

        # Create a mapping of {room_id: room_name} for quick lookup later
        room_names = {str(r.room_id): r.name for r in user_rooms}
        room_ids = [r.room_id for r in user_rooms]
        print(room_ids)
        # 2. Fetch all members for those specific rooms
        all_members = db.session.query(
            RoomMember.room_id,
            User.username,
            RoomMember.overall_room_score,
            RoomMember.rank
        ).join(User, RoomMember.user_id == User.user_id) \
            .filter(RoomMember.room_id.in_(room_ids)) \
            .order_by(RoomMember.room_id, RoomMember.rank.asc()) \
            .all()

        # 3. Structure the response
        # We'll return an object where each key contains 'name' and 'leaderboard'
        rooms_data = {}
        for member in all_members:
            rid = str(member.room_id)
            if rid not in rooms_data:
                rooms_data[rid] = {
                    "name": room_names.get(rid, "Unknown Room"),
                    "leaderboard": []
                }

            rooms_data[rid]["leaderboard"].append({
                "username": member.username,
                "score": member.overall_room_score,
                "rank": member.rank
            })
        print(rooms_data)
        return jsonify({
            "status": "success",
            "rooms": rooms_data
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
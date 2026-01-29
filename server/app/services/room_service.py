import random, string
from typing import List, Dict, Union
from datetime import datetime
from flask_socketio import emit
from app.core.connect_redis import redis_connect
from app.models import Room, db, RoomMember, User

#
redis_client = redis_connect()


def generate_room_code(length=4):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))


def create_new_room(room_name: str, admin_id: str):
    # Phase 1: Save to Postgres to get the official room_id
    new_room = Room(name=room_name)
    db.session.add(new_room)
    db.session.commit()  # Database generates the UUID here

    db_id = str(new_room.room_id)
    room_code = generate_room_code()  # Your 4-digit code generator

    # Phase 2: Initialize in Redis
    metadata_key = f"room:{db_id}:metadata"
    print(metadata_key)
    room_metadata = {
        "status": "active",
        "name": room_name,
        "created_at": datetime.utcnow().isoformat(),
        "admin": admin_id,
        "password": room_code  # Using room_code as password
    }

    # Store metadata and a reverse lookup for the 4-digit code
    redis_client.hset(metadata_key, mapping=room_metadata)
    redis_client.set(f"room_code:{room_code}", db_id)

    return room_code, db_id


def create_room_for_existing_leaderboard(admin_id: str, room_id: str):
    results = (db.session.query(
        Room.room_id,
        Room.name,
        Room.created_at,
        RoomMember.user_id,
        RoomMember.rank,
        RoomMember.overall_room_score,
        User.username  # Added to populate player data
    ).join(
        RoomMember, RoomMember.room_id == Room.room_id
    ).join(
        User,
        User.user_id == RoomMember.user_id
    ).filter(
        Room.room_id == room_id
    ).all())

    if not results:
        return {"error": "Room not found or has no members"}, 404

    # Access the first row for room-level details
    first_row = results[0]
    room_code = generate_room_code(4)
    metadata_key = f"room:{room_id}:metadata"

    # 2. Sync Metadata to Redis
    room_metadata = {
        "status": "active",
        "name": first_row.name,
        "created_at": first_row.created_at.isoformat() if first_row.created_at else datetime.utcnow().isoformat(),
        "admin": admin_id,
        "password": room_code
    }
    redis_client.hset(metadata_key, mapping=room_metadata)
    redis_client.set(f"room_code:{room_code}", room_id)

    # 3. Sync Players and Scores to Redis
    room_members_list = []
    player_set_key = f"room:{room_id}:players"
    leaderboard_key = f"game:{room_id}:leaderboard"

    for member in results:
        user_id_str = str(member.user_id)

        # Add to the Room Presence Set
        redis_client.sadd(player_set_key, user_id_str)
        status = "inactive"
        if user_id_str == admin_id:
            status = "active"
        # Add to Player Data Hash (to keep status/name handy)
        redis_client.hset(f"player:{user_id_str}:data", mapping={
            # "id": user_id_str,
            "name": member.username,
            "status": status
        })

        # Sync the score to the Redis Sorted Set (The Leaderboard)
        redis_client.zadd(leaderboard_key, {user_id_str: 0})

        room_members_list.append({
            "user_id": user_id_str,
            "username": member.username,
            "rank": member.rank,
            "status": status,
            "overall_room_score": member.overall_room_score
        })

    return {
        "room_id": str(first_row.room_id),
        "name": first_row.name,
        "room_code": room_code,
        "admin_id": admin_id,
        "created_at": first_row.created_at,
        "room_members": room_members_list
    }


# def create_room_for_existing_leaderboard(admin_id: str, room_id: str):
#     existing_room = (db.session.query(
#         Room.room_id,
#         Room.name,
#         Room.created_at,
#         RoomMember.user_id,
#         RoomMember.rank,
#         RoomMember.overall_room_score
#     ).join(RoomMember, RoomMember.room_id == Room.room_id).filter(Room.room_id == room_id).all())
#
#     metadata_key = f"room:{room_id}:metadata"
#     room_code = generate_room_code(4)
#     print(metadata_key)
#     room_metadata = {
#         "status": "active",
#         "name": existing_room.name,
#         "created_at": datetime.utcnow().isoformat(),
#         "admin": admin_id,
#         "password": room_code  # Using room_code as password
#     }
#
#     # Store metadata and a reverse lookup for the 4-digit code
#     redis_client.hset(metadata_key, mapping=room_metadata)
#     redis_client.set(f"room_code:{room_code}", room_id)
#
#     room_members = []
#
#     for room_member in existing_room:
#         room_members.append({
#             "user_id": str(room_member.user_id),
#             "rank": room_member.rank,
#             "overall_room_score": room_member.overall_room_score
#         })
#
#     return {
#         "room_id": str(existing_room.room_id),
#         "name": existing_room.name,
#         "room_code": room_code,
#         "admin_id": admin_id,
#         "created_date": existing_room.created_date,
#         "room_members": room_members
#     }


def handle_player_join_event(db_room_id, user_id, player_name):
    """
    Updates Redis state and emits a socket event to the room.
    """
    # 1. Update Room Presence in Redis
    # Adds the user_id to the set of players for this specific room
    redis_client.sadd(f"room:{db_room_id}:players", user_id)

    # 2. Update Player Status in Redis
    # Marks this specific player as 'active' in their detail hash
    player_data_key = f"player:{user_id}:data"
    redis_client.hset(player_data_key, mapping={
        "id": user_id,
        "name": player_name,
        "status": "active"
    })

    # 3. Emit Socket Event
    # We broadcast the full player object so the frontend can update
    # the list without a page refresh or extra API call.
    player_payload = {
        "user_id": user_id,
        "name": player_name,
        "status": "active"
    }

    results = (db.session.query(
        Room.room_id,
        Room.name,
        Room.created_at,
        RoomMember.user_id,
        RoomMember.rank,
        RoomMember.overall_room_score,
        User.username  # Added to populate player data
    ).join(
        RoomMember, RoomMember.room_id == Room.room_id
    ).join(
        User,
        User.user_id == RoomMember.user_id
    ).filter(
        Room.room_id == db_room_id
    ).all())

    room_members = []
    for member in results:
        user_id_str = str(member.user_id)

        # Add to the Room Presence Set
        status = "inactive"
        if user_id_str == user_id:
            status = "active"

        room_members.append({
            "user_id": user_id_str,
            "username": member.username,
            "rank": member.rank,
            "status": status,
            "overall_room_score": member.overall_room_score
        })
    # Emit to the specific room 'db_id'
    # Everyone currently 'listening' to this room ID will receive the data.
    emit('player_joined', player_payload, room=db_room_id, namespace='/game')
    first_row = results[0]
    return {
        "name": first_row.name,
        "created_at": first_row.created_at,
        "room_members": room_members
    }


def list_rooms(user_id: str):
    rooms = db.session.query(
        Room.room_id,
        Room.name,
        Room.created_at,
        RoomMember.user_id,
        RoomMember.rank,
        RoomMember.overall_room_score
    ).join(RoomMember, RoomMember.room_id == Room.room_id) \
        .filter(RoomMember.user_id == user_id) \
        .all()

    room_list = []
    for room in rooms:
        room_list.append({
            "room_id": str(room.room_id),
            "name": room.name,
            "created_at": room.created_at.isoformat() if room.created_at else None,
            "rank": room.rank,
            "overall_room_score": room.overall_room_score
        })

    return room_list


# def create_room(db_room_id: str, admin_id: str):
#     room_code = generate_room_code()
#     redis_client.sadd(f"room:{room_code}:players", "")
#     # 2. Define the key using the Database ID for easy syncing later
#     metadata_key = f"room:{db_room_id}:metadata"
#
#     # 3. Prepare metadata following your requested structure
#     room_metadata = {
#         "status": "active",
#         "created_at": datetime.utcnow().isoformat(),
#         "admin": admin_id,
#         "password": room_code  # The code itself is the password
#     }
#
#     # 4. Store in Redis
#     redis_client.hset(metadata_key, mapping=room_metadata)
#
#     # 5. Create a reverse lookup (Helper Key)
#     # Since users will type the 4-digit code to join, we need to find the db_id
#     redis_client.set(f"room_code:{room_code}", db_room_id)
#
#     return room_code, db_room_id
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

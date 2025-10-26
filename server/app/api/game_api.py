from flask import Blueprint, jsonify
from app.services.room_service import create_room

game_bp = Blueprint("game", __name__)

@game_bp.route("/create-room", methods=["POST"])
def create_room_route():
    room_code = create_room()
    return jsonify({"roomCode": room_code})

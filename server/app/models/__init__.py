# app/models/__init__.py
from app.extensions import db

# Import all models here so they are registered with SQLAlchemy
from app.models.users import User
from app.models.room import Room
from app.models.room_members import RoomMember
from app.models.game import Game
from app.models.round import Round
from app.models.player_round_schema import PlayerRoundScore
from app.models.game_total_score import GameTotalScore

# This allows you to import 'db' and any model directly from 'app.models'
__all__ = [
    "db",
    "User",
    "Room",
    "RoomMember",
    "Game",
    "Round",
    "PlayerRoundScore",
    "GameTotalScore"
]
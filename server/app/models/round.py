from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

db = SQLAlchemy()


class Round(db.Model):
    __tablename__ = 'rounds'
    round_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id = db.Column(UUID(as_uuid=True), db.ForeignKey('games.game_id'))
    total_cards = db.Column(db.Integer)
    total_players = db.Column(db.Integer)
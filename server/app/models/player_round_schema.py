from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class PlayerRoundScore(db.Model):
    __tablename__ = 'player_round_scores'
    round_id = db.Column(UUID(as_uuid=True), db.ForeignKey('rounds.round_id'), primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), primary_key=True)
    score = db.Column(db.Integer, nullable=False)
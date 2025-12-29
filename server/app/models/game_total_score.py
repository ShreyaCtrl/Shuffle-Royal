from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class GameTotalScore(db.Model):
    __tablename__ = 'game_total_scores'
    game_id = db.Column(UUID(as_uuid=True), db.ForeignKey('games.game_id'), primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), primary_key=True)
    total_score = db.Column(db.Integer, nullable=False)
    rank = db.Column(db.Integer)
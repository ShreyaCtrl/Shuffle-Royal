from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.extensions import db


class Round(db.Model):
    __tablename__ = 'rounds'
    round_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id = db.Column(UUID(as_uuid=True), db.ForeignKey('games.game_id'))
    total_cards = db.Column(db.Integer)
    total_players = db.Column(db.Integer)

    def to_dict(self):
        return {
            "round_id": self.round_id,
            "game_id": self.game_id,
            "total_cards": self.total_cards,
            "total_players": self.total_players
        }

from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class Game(db.Model):
    __tablename__ = 'games'
    game_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = db.Column(db.String(50), db.ForeignKey('rooms.room_id'))
    started_at = db.Column(db.DateTime, default=datetime.utcnow)

    rounds = db.relationship('Round', backref='game', lazy=True)
    total_scores = db.relationship('GameTotalScore', backref='game', lazy=True)


# from mongoengine import Document, StringField, IntField, EmbeddedDocumentField, EmbeddedDocument, DateTimeField, ListField
#
# class Rules_Schema(EmbeddedDocument):
#     max_players = IntField(required=True, default=2)
#     min_players = IntField(required=True, default=2)
#
# class Games_Schema(Document):
#     game_id = StringField(required=True, unique=True)
#     game_name = StringField(required=True, unique=True)
#     # description = StringField(required=False)
#     rules = EmbeddedDocumentField(Rules_Schema, required=True)
#
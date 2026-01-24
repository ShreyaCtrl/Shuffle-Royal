from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    google_id = db.Column(db.String(100))
    password_hash = db.Column(db.Text)
    avatar_url = db.Column(db.Text)
    games_played = db.Column(db.Integer, default=0)
    games_won = db.Column(db.Integer, default=0)

    # Relationships
    room_memberships = db.relationship('RoomMember', backref='user', lazy=True)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "google_id": self.google_id,
            "password_hash": self.password_hash,
            "avatar_url": self.avatar_url,
            "games_played": self.games_played,
            "games_won": self.games_won
        }

# from mongoengine import Document, StringField, DateTimeField, IntField, ListField
# from datetime import datetime
#
# class User_Schema(Document):
#     username = StringField(required=True, unique=True)
#     email= StringField(required=True, unique=True)
#     google_id = StringField(required=False, unique=True)
#     avatar = StringField(required=True, default='')
#     password = StringField()
#     games_played = IntField(default=0)
#     games_won = IntField(default=0)
#     friends= ListField(StringField(), default=[])
#     created_at = DateTimeField(default=datetime.utcnow)
#     total_score = IntField(default=0)
#     game_history = ListField(StringField())
#
#     meta={
#         'collection': 'users',
#         'indexes': [
#             'username',
#             'email'
#         ]
#     }
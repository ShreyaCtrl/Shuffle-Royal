from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

db = SQLAlchemy()

class Room(db.Model):
    __tablename__ = 'rooms'
    room_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    games = db.relationship('Game', backref='room', lazy=True)
    members = db.relationship('RoomMember', backref='room', lazy=True)

# from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField
# from datetime import datetime
# from app.models.users import User_Schema
#
# class Room_Schema(Document):
#     group_id = StringField(required=True, unique=True)
#     name = StringField(required=True)
#     members = ListField(ReferenceField(User_Schema), default=[])
#     created_at = DateTimeField(default=datetime.utcnow)
#
#     meta = {
#         'collection': 'rooms',
#         'indexes': ['group_id', 'name']
#     }
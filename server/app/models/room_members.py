from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class RoomMember(db.Model):
    __tablename__ = 'room_members'
    room_id = db.Column(db.String(50), db.ForeignKey('rooms.room_id'), primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), primary_key=True)
    username = db.Column(db.String(50))
    status = db.Column(db.String(20), default='active')
    overall_room_score = db.Column(db.Integer, default=0)
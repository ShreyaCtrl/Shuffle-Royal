from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class RoomMember(db.Model):
    __tablename__ = 'room_members'
    room_id = db.Column(db.String(50), db.ForeignKey('rooms.room_id'), primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), primary_key=True)
    status = db.Column(db.String(20), default='active')
    overall_room_score = db.Column(db.Integer, default=0)
    rank = db.Column(db.Integer)

    def to_dict(self):
        return {
            "room_id": self.room_id,
            "user_id": self.user_id,
            "status": self.status,
            "overall_room_score": self.overall_room_score,
            "rank": self.rank
        }
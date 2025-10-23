from mongoengine import Document, StringField, DateTimeField, IntField, ListField
from datetime import datetime

class User_Schema(Document):
    username = StringField(required=True, unique=True)
    email= StringField(required=True, unique=True)
    google_id = StringField(required=False, unique=True)
    avatar = StringField(required=True, default='')
    password = StringField()
    games_played = IntField(default=0)
    games_won = IntField(default=0)
    friends= ListField(StringField(), default=[])
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta={
        'collection': 'users',
        'indexes': [
            'username',
            'email'
        ]
    }
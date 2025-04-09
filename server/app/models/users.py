from mongoengine import Document, StringField, DateTimeField, IntField, ListField
from datetime import datetime

class User_Schema(Document):
    _id = StringField(required=True, unique=True)
    username = StringField(required=True, unique=True)
    email= StringField(required=True, unique=True)
    google_id = StringField(required=True, unique=True)
    avatar = StringField(required=True ,default='')
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
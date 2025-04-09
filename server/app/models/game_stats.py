from mongoengine import Document, StringField, IntField, DateTimeField, ListField, EmbeddedDocumentField, EmbeddedDocument
from datetime import datetime 

class PlayerScore_Schema(EmbeddedDocument):
    # The player_id is the same as the user_id in the User_Schema
    # player_id = StringField(required=True)
    player_name = StringField(required=True)
    player_score = IntField(required=True, default=0)

class GameStats_Schema(Document):
    gamestats_id = StringField(required=True, unique=True)
    player_scores = ListField(EmbeddedDocumentField(PlayerScore_Schema), default=[])
    winner = StringField(required=True)
    created_at = DateTimeField(default=datetime.now)
    ended_at = DateTimeField(default=None)

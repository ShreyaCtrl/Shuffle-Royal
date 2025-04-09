from mongoengine import Document, StringField, IntField, EmbeddedDocumentField, EmbeddedDocument, DateTimeField, ListField

class Rules_Schema(EmbeddedDocument):
    max_players = IntField(required=True, default=2)
    min_players = IntField(required=True, default=2)

class Games_Schema(Document):
    game_id = StringField(required=True, unique=True)
    game_name = StringField(required=True, unique=True)
    description = StringField(required=False)
    rules = EmbeddedDocumentField(Rules_Schema, required=True)
    
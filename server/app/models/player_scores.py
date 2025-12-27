# from mongoengine import Document, StringField, DateTimeField, IntField, ListField, EmbeddedDocument, EmbeddedDocumentField
# from datetime import datetime
#
# class Game_Record_Schema(EmbeddedDocument):
#     game_id = StringField(required=True)
#     prediction = IntField(required=True)
#     hands_won = IntField(required=True)
#     score = IntField(required=True)
#     timestamp = DateTimeField(required=True)
#
# class Player_Score_Schema(Document):
#     player_id = StringField(required=True, unique=True)  # e.g., "sarita_001"
#     name = StringField(required=True)                    # e.g., "Sarita"
#     games = ListField(EmbeddedDocumentField(Game_Record_Schema), default=[])
#     total_score = IntField(default=0)
#     created_at = DateTimeField(default=datetime.utcnow)
#
#     meta = {
#         'collection': 'player_scores',
#         'indexes': [
#             'player_id',
#             'name'
#         ]
#     }
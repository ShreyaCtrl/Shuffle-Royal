# from mongoengine import Document, StringField, DateTimeField, IntField, ListField, EmbeddedDocument, EmbeddedDocumentField
# from datetime import datetime
#
# class Game_Player(EmbeddedDocument):
#     player_id = StringField(required=True)
#     name = StringField(required=True)
#     total_score = IntField(required=True)
#     rounds_lost = IntField(required=True)
# class Game_Result(Document):
#     game_id = StringField(required=True, unique=True)
#     players = ListField(EmbeddedDocumentField(Game_Player), default=[])
#     timestamp = DateTimeField(default=datetime.utcnow)
#
#     meta = {
#         'collection': 'game_results',
#         'indexes': [
#             'game_id',
#             'timestamp'
#         ]
#     }
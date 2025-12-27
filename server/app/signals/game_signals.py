from mongoengine import signals
from app.models.users import User_Schema
from app.models.game_result import Game_Result  # your Game_Result model


def update_user_stats(sender, document, **kwargs):
    """
    Triggered whenever a Game_Result document is saved.
    Updates each user's total score and games played/won.
    """
    for player in document.players:
        user = User_Schema.objects(id=player.player_id).first()
        if user:
            user.update(
                inc__games_played=1,
                inc__total_score=player.total_score
            )
            if document.winner == user.username:
                user.update(inc__games_won=1)


# Connect the signal to Game_Result post-save
signals.post_save.connect(update_user_stats, sender=Game_Result)

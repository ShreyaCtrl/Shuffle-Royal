game_schema = {
    "game_id": str,
    "player_scores": [
        {
            # Player id here is the object id of the user in the collection of users data 
            "player_id": str,
            "score": int,
            "username": str,
        }
    ],
    "winner": str, 
    "created_at": str,
    "ended_at": str
}
from app.core.connect_mongo import mongo_connect

user_schema = {
    "google_id": str,
    "email": str,
    "name": str,
    "avatar": str,
    "created_at": str,
    "last_login": str,
    "games_played": int,
    "wins": int,
    "friends": list[str],
}
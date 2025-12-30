from flask import Blueprint, jsonify, session
from app.models import User  # Adjust based on your file structure
from app.extensions import db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile/me', methods=['GET'])
def get_current_profile():
    # 1. Get the session dictionary

    user_session = session.get("user")
    print(user_session)
    # 2. Check if the user is logged in
    if not user_session or "id" not in user_session:
        return jsonify({
            "status": "error",
            "message": "Unauthorized: Please log in"
        }), 401

    # 3. Use the ID from the dictionary to query the database
    # Note: Ensure the ID is a string or UUID as per your DB column type
    user_id = user_session["id"]
    user = User.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    # 4. Return the response to the React frontend
    return jsonify({
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "avatar": user.avatar_url,
            "games_played": user.games_played,
            "games_won": user.games_won
        }
    }), 200
from flask import Blueprint, url_for, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.core.connect_oauth import oauth_connect
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.models.users import User_Schema
from app.core.config import client_id
from app.utils.username_generator import generate_unique_username


users_bp = Blueprint("users", __name__)

google = None

def init_oauth(app):
    global google
    oauth, google = oauth_connect(app)

@users_bp.route("/login/google", methods=["GET"])
def login_google():
    redirect_uri = url_for("users.auth_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@users_bp.route("/auth/callback", endpoint="auth_callback", methods=["GET"])
def authorize():
    token = google.authorize_access_token()
    user_info = google.get("userinfo").json()

    user = User_Schema.objects(email=user_info["email"]).first()
    if not user:
        user = User_Schema(
            username=user_info.get("name"),
            email=user_info.get("email"),
            google_id=user_info.get("id"),
            avatar=user_info.get("picture", "")
        ).save()

    session["user"] = {"id": str(user.id), "email": user.email}
    return jsonify({
        "status": "success",
        "message": "Logged in with Google",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "avatar": user.avatar
        }
    })

@users_bp.route("/login", methods=["GET", "POST"])
def login_form():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = User_Schema.objects(email=email).first()
        if user and hasattr(user, "password") and check_password_hash(user.password, password):
            session["user"] = {"id": str(user.id), "email": user.email}
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "username": user.username
                }
            })
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    return jsonify({
        "status": "info",
        "message": "Use POST with email & password to login, or visit /login/google for Google login"
    })

@users_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json() or request.form  # supports both JSON and FormData
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")
    confirm_password = data.get("confirmPassword")

    username_gen = generate_unique_username(username)

    # 1️⃣ Check for missing fields
    if not email or not password or not confirm_password:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    # 2️⃣ Confirm passwords match
    if password != confirm_password:
        return jsonify({"status": "error", "message": "Passwords do not match"}), 400

    # 3️⃣ Check if user already exists
    existing_user = User_Schema.objects(email=email).first()
    if existing_user:
        return jsonify({"status": "error", "message": "User already exists. Please log in."}), 409

    # 4️⃣ Create new user (store hashed password)
    hashed_password = generate_password_hash(password)
    new_user = User_Schema(email=email, password=hashed_password, username=username).save()

    # 5️⃣ Log the user in by starting a session
    session["user"] = {"id": str(new_user.id), "email": new_user.email}

    # 6️⃣ Return success response
    return jsonify({
        "status": "success",
        "message": "Registration successful",
        "user": {
            "id": str(new_user.id),
            "email": new_user.email
        }
    }), 201
#
# @users_bp.route("/auth/google", methods=["POST"])
# def google_auth():
#     data = request.get_json()
#     token = data.get("token")
#     print(token)
#
#     if not token:
#         return jsonify({"status": "error", "message": "No token provided"}), 400
#
#     try:
#         # Verify JWT token with Google
#         idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
#         print(idinfo)
#         email = idinfo.get("email")
#         name = idinfo.get("name")
#         picture = idinfo.get("picture")
#         google_id = idinfo.get("sub")  # unique Google ID
#
#         # Check if user exists
#         user = User_Schema.objects(email=email, username=name, google_id=google_id, avatar =picture).first()
#         if not user:
#             # Create new user if doesn't exist
#             user = User_Schema(
#                 email=email,
#                 username=name,
#                 google_id=google_id,
#                 avatar=picture
#             ).save()
#
#         # Log the user in by starting a session
#         session["user"] = {"id": str(user.id), "email": user.email}
#
#         return jsonify({
#             "status": "success",
#             "message": "Logged in with Google",
#             "user": {
#                 "id": str(user.id),
#                 "email": user.email,
#                 "username": user.username,
#                 "avatar": user.avatar
#             }
#         })
#
#     except ValueError:
#         return jsonify({"status": "error", "message": "Invalid token"}), 400

@users_bp.route("/auth/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({"status": "error", "message": "No token provided"}), 400

    try:
        # ✅ Verify JWT token with Google
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")
        google_id = idinfo.get("sub")  # unique Google ID
        username_gen = generate_unique_username(name)

        # ✅ Check if user already exists by google_id or email
        user = User_Schema.objects.filter(__raw__={"$or": [{"google_id": google_id}, {"email": email}]}).first()

        if not user:
            # ✅ Create a new user only if they don't exist
            user = User_Schema(
                email=email,
                username=username_gen,
                google_id=google_id,
                avatar=picture
            ).save()
            message = "Registered new user via Google"
        # else:
        #     # ✅ Update existing user’s name/picture if changed
        #     user.update(username=user, avatar=picture)
        #     message = "Logged in existing Google user"

        # ✅ Log the user in by starting a session
        session["user"] = {"id": str(user.id), "email": user.email}

        return jsonify({
            "status": "success",
            "message": message,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "avatar": user.avatar
            }
        })

    except ValueError:
        return jsonify({"status": "error", "message": "Invalid token"}), 400

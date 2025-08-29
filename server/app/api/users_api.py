from flask import Blueprint, url_for, request, session
from werkzeug.security import check_password_hash
from app.core.connect_oauth import oauth_connect
from app.models.users import User_Schema

users_bp = Blueprint("users", __name__)

google = None

def init_oauth(app):
    global google
    oauth, google = oauth_connect(app)


# @users_bp.route("/login", methods=['GET'])
# def login():
#     redirect_uri = url_for("users.auth_callback", _external=True)
#     return google.authorize_redirect(redirect_uri)
#
#
# @users_bp.route("/auth/callback", endpoint="auth_callback", methods=['GET'])
# def authorize():
#     token = google.authorize_access_token()
#     user_info = google.get("userinfo").json()
#     session["user"] = user_info
#     return f"Hello {user_info['email']}"
#
#
# @users_bp.route("/logout", methods=['GET'])
# def logout():
#     session.pop("user", None)
#     return redirect(url_for("users_bp.login"))

@users_bp.route("/login/google", methods=["GET"])
def login_google():
    redirect_uri = url_for("users.auth_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@users_bp.route("/auth/callback", endpoint="auth_callback", methods=["GET"])
def authorize():
    token = google.authorize_access_token()
    user_info = google.get("userinfo").json()

    # Upsert user in DB
    user = User_Schema.objects(email=user_info["email"]).first()
    if not user:
        user = User_Schema(email=user_info["email"], name=user_info.get("name")).save()

    session["user"] = {"id": str(user.id), "email": user.email}
    return f"Hello {user.email}, you are logged in with Google!"


# -------- EMAIL/PASSWORD LOGIN --------
@users_bp.route("/login", methods=["GET", "POST"])
def login_form():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = User_Schema.objects(email=email).first()
        if user and check_password_hash(user.password, password):
            session["user"] = {"id": str(user.id), "email": user.email}
            return f"Welcome back, {user.email}!"
        else:
            return "Invalid email or password", 401

    # If GET request, show login options
    return f"Login successful"
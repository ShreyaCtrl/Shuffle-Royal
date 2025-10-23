from app.core.connect_mongo import mongo_connect
from app.api.users_api import init_oauth
from flask import Flask, redirect, url_for, session
from app.api.users_api import users_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
app.secret_key = 'aksdwodkfjksdfjwo'
app.secret_key = "random_secret_key"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "some_secret_key"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False  # True if using HTTPS
app.config["SESSION_COOKIE_DOMAIN"] = "localhost"

db = mongo_connect()
init_oauth(app)

app.register_blueprint(users_bp)

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)
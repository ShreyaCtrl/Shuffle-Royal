import eventlet
eventlet.monkey_patch()
from dotenv import load_dotenv
load_dotenv('.env')

from flask_socketio import SocketIO
from flask import Flask, redirect, url_for, session
from flask_cors import CORS

# from app.core.connect_mongo import mongo_connect
from app.core.config import redis_uri
from app.core.connect_redis import redis_connect
from app.core.connect_supabase import supabase_connect
from app.api.users_api import init_oauth
# from app.models.users import User_Schema
# from app.models.game_result import Game_Result  # Import models first
# from app.signals.game_signals import update_user_stats
# from app.api.users_api import users_bp
# from app.api.game_api import game_bp

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://a00b7d19a523.ngrok-free.app"],
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
app.secret_key = 'aksdwodkfjksdfjwo'
app.secret_key = "random_secret_key"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False  # True if using HTTPS
app.config["SESSION_COOKIE_DOMAIN"] = "localhost"
app.config["SECRET_KEY"] = "some_secret_key"


# socketio = SocketIO(app, cors_allowed_origins="*")

# db = mongo_connect()
db = supabase_connect()
init_oauth(app)

redis_client = redis_connect()

# app.register_blueprint(users_bp)
# app.register_blueprint(game_bp)

# app = Flask(__name__)
# print(redis_uri, '------------------------------main.py')
socketio = SocketIO(app, async_mode='eventlet', message_queue=redis_uri, ping_timeout=60, ping_interval=30)  # Optional: specify async mode
#
if __name__ == '__main__':
    # app.run(port=5000, host='localhost', debug=True)
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

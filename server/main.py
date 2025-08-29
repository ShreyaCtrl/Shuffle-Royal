from app.core.connect_mongo import mongo_connect
from app.api.users_api import init_oauth
from flask import Flask, redirect, url_for, session
from app.api.users_api import users_bp

app = Flask(__name__)
app.secret_key = 'aksdwodkfjksdfjwo'

db = mongo_connect()
init_oauth(app)

app.register_blueprint(users_bp)

if __name__ == '__main__':
    app.run(debug=True)
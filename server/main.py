from app.core.connect_mongo import mongo_connect
from app.core.connect_oauth import oauth_connect
from flask import Flask, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'aksdwodkfjksdfjwo'

db = mongo_connect()
google = oauth_connect(app)

@app.route('/')
def home():
    return '<a href="/login">Login with Google</a>'

@app.route('/login')
def login():
    redirect_uri = url_for('auth_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/auth/callback')
def auth_callback():
    token = google.authorize_access_token()
    user_info = google.get('userinfo').json()
    return f'Hello {user_info["name"]}! Your email is {user_info["email"]}.'

if __name__ == '__main__':
    app.run(debug=True)
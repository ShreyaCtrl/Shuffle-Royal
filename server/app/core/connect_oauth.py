from authlib.integrations.flask_client import OAuth
from .config import client_id, client_secret


def oauth_connect(app):
    oauth = OAuth()
    oauth.init_app(app)
    google = oauth.register(
        name='google',
        client_id=client_id,
        client_secret=client_secret,
        access_token_url='https://oauth2.googleapis.com/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params=None, api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'openid email profile'}
    )
    return google
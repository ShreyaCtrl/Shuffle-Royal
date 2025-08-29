from app.models.users import User_Schema
from app.core.config import jwt_algorithm, private_key, public_key

class Users_Controller(User_Schema):
    def create_user():
        pass
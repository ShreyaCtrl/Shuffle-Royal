import random
from app.models.users import User, db

ADJECTIVES = ["Swift", "Brave", "Sneaky", "Loyal", "Mighty", "Clever", "Bold", "Calm"]
ANIMALS = ["Tiger", "Falcon", "Otter", "Wolf", "Lion", "Hawk", "Panther", "Fox"]

def is_taken(username: str) -> bool:
    """Return True if username exists in DB."""
    if not username:
        return True
    return db.session.query(User.user_id).filter_by(username=username).first() is not None

def generate_username():
    """Generate a random username like 'BraveWolf123'."""
    adj = random.choice(ADJECTIVES)
    animal = random.choice(ANIMALS)
    number = random.randint(100, 999)
    return f"{adj}{animal}{number}"

def generate_unique_username(requested_username):
    """Keep generating usernames until one is unique in the DB."""
    if not requested_username or is_taken(requested_username):
        while True:
            new_name = generate_username()
            if not is_taken(new_name):
                return new_name

    return requested_username
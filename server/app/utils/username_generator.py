import random
from app.models.users import User_Schema

ADJECTIVES = ["Swift", "Brave", "Sneaky", "Loyal", "Mighty", "Clever", "Bold", "Calm"]
ANIMALS = ["Tiger", "Falcon", "Otter", "Wolf", "Lion", "Hawk", "Panther", "Fox"]

def is_taken(username: str) -> bool:
    """Return True if username exists in DB."""
    if not username:
        return True
    return bool(User_Schema.objects(username=username).first())

def generate_username(username: str):
    """Generate a random username like 'BraveWolf123'."""
    if is_taken(username):
        adj = random.choice(ADJECTIVES)
        animal = random.choice(ANIMALS)
        number = random.randint(100, 999)
        return f"{adj}{animal}{number}"
    else:
        return username

def generate_unique_username(username):
    """Keep generating usernames until one is unique in the DB."""
    while True:
        username = generate_username(username)
        if not User_Schema.objects(username=username).first():
            return username

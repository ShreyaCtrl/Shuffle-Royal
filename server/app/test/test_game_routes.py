import pytest
import json
from flask import Flask
from flask_socketio import SocketIO, join_room
from app.api.game_api import game_bp, register_game_routes
from app.core.connect_redis import redis_connect

from socketio import Client

redis_client = redis_connect()

@pytest.fixture(scope="module")
def test_app():
    """Setup Flask app and SocketIO for testing"""
    app = Flask(__name__)
    app.register_blueprint(game_bp)
    socketio = SocketIO(app, cors_allowed_origins="*")
    register_game_routes(socketio)
    yield app, socketio


@pytest.fixture
def client(test_app):
    app, _ = test_app
    with app.test_client() as client:
        yield client


def test_create_room(client):
    """✅ Test HTTP route: /create-room"""
    response = client.post("http://localhost/create-room")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "roomCode" in data
    print("🧩 Room created:", data["roomCode"])


def test_socket_game_flow(test_app):
    """✅ Test joining, submitting predictions, and revealing"""
    app, socketio = test_app

    # --- Setup two test clients ---
    client1 = socketio.test_client(app, flask_test_client=app.test_client())
    client2 = socketio.test_client(app, flask_test_client=app.test_client())

    room = "AB12"

    # --- Join Room ---
    client1.emit("join_room", {"username": "player1", "room": room})
    client2.emit("join_room", {"username": "player2", "room": room})

    # Check if room_update broadcasted correctly
    received1 = client1.get_received()
    received2 = client2.get_received()

    assert any(r["name"] == "room_update" for r in received1)
    assert any(r["name"] == "room_update" for r in received2)
    print("👥 Both players joined successfully")

    # --- Submit Predictions ---
    client1.emit("submit_prediction", {"username": "player1", "room": room, "prediction": 2})
    client2.emit("submit_prediction", {"username": "player2", "room": room, "prediction": 3})

    # After all predictions submitted → reveal_predictions should be sent
    received_final = client1.get_received()
    event_names = [r["name"] for r in received_final]

    assert "reveal_predictions" in event_names
    print("📜 Predictions revealed:", received_final)

    # Clean up test data
    redis_client.delete(f"room:{room}:players")
    redis_client.delete(f"room:{room}:predictions")
    print("🧹 Redis room data cleaned up after test")

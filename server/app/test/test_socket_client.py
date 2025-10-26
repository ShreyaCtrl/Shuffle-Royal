import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("✅ Connected to server!")

@sio.on("room_update")
def on_room_update(data):
    print("👥 Room updated:", data)

@sio.on("reveal_predictions")
def on_reveal_predictions(data):
    print("📜 All predictions revealed:", data)

@sio.event
def disconnect():
    print("❌ Disconnected from server.")

# Connect to Flask-SocketIO backend
sio.connect("http://0.0.0.0:5000")

# Join a room
sio.emit("join_room", {"username": "player1", "room": "AB12"})

# Submit a prediction
sio.emit("submit_prediction", {"username": "player1", "room": "AB12", "prediction": 2})

# Wait for events
sio.wait()

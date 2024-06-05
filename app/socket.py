from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
import os

app = Flask(__name__)

# Adjust this URL to match your Render deployment URL
RENDER_URL = os.getenv("https://bonfire-nrgu.onrender.com/", "http://localhost:8000")

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        f"https://{RENDER_URL}",
    ]
else:
    origins = "*"

socketio = SocketIO(app, cors_allowed_origins=origins)

@socketio.on("chat")
def handle_chat(data):
    emit('chat', data, broadcast=False, to=data['room'], include_self=False)

@socketio.on('leave')
def handle_leave(data):
    leave_room(data['room'])

@socketio.on('join')
def handle_join(data):
    join_room(data['room'])

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    socketio.run(app, debug=True)

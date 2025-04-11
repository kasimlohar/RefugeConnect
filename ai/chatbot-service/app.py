# app.py: Main entry point for chatbot service
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    return jsonify({'reply': f'You said: {user_message}'})

if __name__ == '__main__':
    app.run(port=5001)

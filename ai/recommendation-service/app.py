# app.py: Main entry point for recommendation service
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = request.json
    return jsonify({'recommendations': ['Job 1', 'Job 2', 'Housing 1']})

if __name__ == '__main__':
    app.run(port=5002)

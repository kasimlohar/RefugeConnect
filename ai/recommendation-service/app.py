# app.py: Main entry point for recommendation service
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

def get_recommendations(preference, filters):
    # Placeholder recommendation logic
    if preference == "job":
        return ["Software Engineer", "Data Scientist", "Project Manager"]
    elif preference == "housing":
        return ["Affordable Apartment", "Shared Housing", "Studio Apartment"]
    else:
        return ["No recommendations available for the given preference."]

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        user_data = request.json
        preference = user_data.get("preference", "").lower()
        filters = user_data.get("filters", {})
        
        if not preference:
            return jsonify({"error": "Preference is required"}), 400
        
        recommendations = get_recommendations(preference, filters)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(port=6000)

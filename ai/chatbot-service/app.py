# app.py: Main entry point for chatbot service
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from langdetect import detect
from deep_translator import GoogleTranslator
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load pre-trained model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")
db = client["chatbot"]
conversations_collection = db["conversations"]

def generate_bot_response(message):
    try:
        # Detect the language of the user input
        detected_language = detect(message)
        app.logger.info(f"Detected language: {detected_language}")

        # Translate input to English if it's not already in English
        translated_message = message
        if detected_language != 'en':
            translated_message = GoogleTranslator(source=detected_language, target='en').translate(message)
            app.logger.info(f"Translated input to English: {translated_message}")

        # Tokenize user input and append end-of-sentence token
        input_ids = tokenizer.encode(translated_message + tokenizer.eos_token, return_tensors="pt")

        # Generate a response using the model
        output_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)

        # Decode the model's output to text
        response = tokenizer.decode(output_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
        app.logger.info(f"Generated bot response in English: {response}")

        # Translate the response back to the original language if necessary
        final_response = response
        if detected_language != 'en':
            final_response = GoogleTranslator(source='en', target=detected_language).translate(response)
            app.logger.info(f"Translated bot response to original language: {final_response}")

        # Log the conversation to MongoDB
        log_entry = {
            "user_input": message,
            "detected_language": detected_language,
            "translated_input": translated_message if detected_language != 'en' else None,
            "bot_response_english": response,
            "final_bot_response": final_response if detected_language != 'en' else response,
            "timestamp": datetime.utcnow()
        }
        conversations_collection.insert_one(log_entry)
        app.logger.info("Conversation logged to MongoDB")

        return final_response
    except Exception as e:
        app.logger.error(f"Error generating bot response: {str(e)}")
        return "Sorry, I couldn't process your request."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '').strip()
        if not user_message:
            app.logger.error('Error: Message is missing in the request body.')
            return jsonify({'error': 'Message is required'}), 400
        app.logger.info(f"Received message: {user_message}")
        bot_reply = generate_bot_response(user_message)
        app.logger.info(f"Generated bot reply: {bot_reply}")
        return jsonify({'response': bot_reply})
    except Exception as e:
        app.logger.error(f"Error in chatbot service: {str(e)}")
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)

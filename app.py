from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.DEBUG)

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/generate-alt-text', methods=['POST'])
def generate_alt_text():
    try:
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")
        text = data['text']
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Generate alt text for data visualizations."},
                {"role": "user", "content": text}
            ],
            max_tokens=150
        )
        
        alt_text = response.choices[0].message['content'].strip()
        app.logger.debug(f"Generated alt text: {alt_text}")
        return jsonify({'altText': alt_text})
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)

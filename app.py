from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import logging

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": "*"}})

logging.basicConfig(level=logging.DEBUG)

# Get the OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/generate-alt-text', methods=['POST', 'OPTIONS'])
def generate_alt_text():
    if request.method == 'OPTIONS':
        # CORS preflight request
        response = app.make_response('')
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,bypass-tunnel-reminder")
        response.headers.add("Access-Control-Allow-Methods", "OPTIONS,POST")
        return response
    
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
        
        response = jsonify({'altText': alt_text})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        response = jsonify({'error': str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 500

if __name__ == '__main__':
    app.run(port=8000)

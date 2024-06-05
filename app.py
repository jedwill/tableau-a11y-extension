from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = 'your-openai-api-key'

@app.route('/generate-alt-text', methods=['POST'])
def generate_alt_text():
    data = request.get_json()
    text = data['text']
    
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Generate alt text for the following data visualization:\n{text}",
        max_tokens=150
    )
    
    alt_text = response.choices[0].text.strip()
    return jsonify({'altText': alt_text})

if __name__ == '__main__':
    app.run(port=5000)

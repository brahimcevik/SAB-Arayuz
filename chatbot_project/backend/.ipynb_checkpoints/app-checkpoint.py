# app.py
import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chatbot import get_response, predict_class, current_context
import json
from colored_logger import get_colored_logger

logger = get_colored_logger()

app = Flask(__name__, template_folder='templates')
CORS(app)

with open(os.path.join(os.path.dirname(__file__), 'intents.json'), 'r', encoding="utf-8") as intentFile:
    intents = json.load(intentFile)

@app.route("/")
def home():
    """Anasayfayı renderlar."""
    return render_template('index.html')

@app.route("/chatbot", methods=['POST'])
def chatbot():
    """Chatbot ile etkileşimde bulunur."""
    logger.debug("Chatbot endpoint'i çağrıldı.")

    if request.headers['Content-Type'] == 'application/json':
        try:
            data = request.get_json()
            logger.debug(f"Gelen veri: {data}") 
            
            msg = data.get('msg')
            if not isinstance(msg, str) or not msg:
                logger.debug("Mesaj hatalı: Mesaj boş veya geçersiz")
                return jsonify({'error': 'Message must be a non-empty string'}), 400

            intents_list = predict_class(msg)
            response, show_options = get_response(intents_list, intents, user_response=msg)  # msg'i user_response olarak geçiyoruz

            return jsonify({
                'response': response,
                'showOptions': show_options,
                'currentContext': current_context
            })

        except Exception as e:
            logger.error(f"Beklenmeyen hata: {e}")
            return jsonify({'response': 'Bir hata oluştu. Lütfen tekrar deneyin.'}), 500
    else:
        logger.debug("Geçersiz Content-Type başlığı") 
        return jsonify({'error': 'Invalid Content-Type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
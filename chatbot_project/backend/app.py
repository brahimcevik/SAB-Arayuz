import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chatbot import get_response, predict_class, current_context
import json
from colored_logger import get_colored_logger
import requests
import re
import urllib3
import google.generativeai as genai
from pymongo import MongoClient
from datetime import datetime, timedelta

import sys
sys.path.append('C:/Users/ibrah/OneDrive/Belgeler/GitHub/SAB-Arayuz/chatbot_project')
from database import (
    save_chat_message,
    save_chat_summary,
    get_chat_history,
    save_mod1_update,
    save_coordinate_update
)
# MongoDB bağlantısı
client = MongoClient('mongodb://localhost:27017/')
db = client['chatbot_db']
chat_history = db['chat_history']
chat_summaries = db['chat_summaries']

genai.configure(api_key='AIzaSyAMXs2S8hKd6RFtIuXFF25C587Y1BNL77E')
model = genai.GenerativeModel('gemini-pro')
current_dir = os.path.dirname(os.path.abspath(__file__))
intents_file = os.path.join(current_dir, 'intents.json')

# intents.json dosyasını yükle
with open(intents_file, 'r', encoding='utf-8') as file:
    intents = json.load(file)

# SSL uyarılarını devre dışı bırak
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logger = get_colored_logger()

app = Flask(__name__, template_folder='templates')
CORS(app)

# Global değişken olarak current_operation
current_operation = None

# Koordinat işlemleri için context
coordinate_context = {
    "active": False,
    "current_step": None,
    "waiting_for_count": False,
    "waiting_for_coordinates": False,
    "coordinate_count": 0,
    "coordinates": [],
    "current_coordinate": 0
}

# Mod1 parametreleri için context
mod1_context = {
    "active": False,
    "current_step": None,
    "parameters": {
        "siraUzunlugu": None,
        "ikiSiraArasiMesafe": None,
        "toplamSiraSayisi": None,
        "donusDerecesi": None,
        "ilkDonusAcisi": None
    }
}

# Mod1 güncelleme adımları
MOD1_STEPS = {
    "UZUNLUK": "Lütfen sıra uzunluğunu metre cinsinden girin:",
    "MESAFE": "Lütfen iki sıra arası mesafeyi metre cinsinden girin:",
    "SIRA_SAYISI": "Lütfen toplam sıra sayısını girin:",
    "DONUS_DERECESI": "Lütfen dönüş derecesini girin:",
    "DONUS_ACISI": "İlk dönüş açısını seçin (Sağ için 1, Sol için 2 yazın):"
}

# Tarımla ilgili kelimeler
tarim_kelimeleri = [
    "tarım", "çiftçi", "tohum", "gübre", "ilaç", "hasat", "ekim", "sulama", 
    "toprak", "sera", "pestisit", "böcek", "zararlı", "ürün", "mahsul", 
    "traktör", "ziraat", "gübreleme", "budama", "fide", "fidan", "meyve",
    "sebze", "bahçe", "arazi", "verim", "üretim", "ekin"
]

@app.route("/")
def home():
    """Anasayfayı renderlar."""
    return render_template('index.html')
@app.route("/chatbot", methods=['POST'])
def chatbot():
    global current_operation

    if request.headers.get('Content-Type') == 'application/json':
        try:
            data = request.get_json(silent=True)
            if data is None:
                return jsonify({'error': 'Invalid JSON'}), 400
            
            logger.debug(f"Gelen veri: {data}")

            msg = data.get('msg', '').lower()
            selected_id = data.get('selectedId')
            is_robot_selected = data.get('isRobotSelected', False)
            user_id = request.remote_addr

            if not isinstance(msg, str) or not msg:
                logger.debug("Mesaj hatalı: Mesaj boş veya geçersiz")
                return jsonify({'error': 'Message must be a non-empty string'}), 400

            logger.debug(f"Selected ID güncellendi: {selected_id}")

            # İptal kontrolü
            if msg.lower() == "iptal":
                coordinate_context.update({
                    "active": False,
                    "current_step": None,
                    "waiting_for_count": False,
                    "waiting_for_coordinates": False,
                    "coordinate_count": 0,
                    "coordinates": [],
                    "current_coordinate": 0
                })
                mod1_context.update({
                    "active": False,
                    "current_step": None,
                    "parameters": {k: None for k in mod1_context["parameters"]}
                })
                current_operation = None
                return jsonify({
                    "response": "İşlem iptal edildi.",
                    "currentContext": "",
                    "showCancelButton": False
                })

            # Intent kontrolü
            intents_list = predict_class(msg)
            logger.info(f"Predict class results: {intents_list}")

            # Mod1 güncelleme kontrolü
            if intents_list and any(intent['intent'] == 'mod1_guncelleme' for intent in intents_list):
                if not selected_id and not is_robot_selected:
                    current_operation = "mod1"
                    robots = fetch_robots_info()
                    return jsonify({
                        "response": "Mod1 parametrelerini güncellemek için önce bir araç seçmelisiniz. Lütfen listeden bir araç seçin:",
                        "currentContext": "robot_sorgulama",
                        "showOptions": True,
                        "showRobots": True,
                        "robots": robots,
                        "showCancelButton": False
                    })
                else:
                    mod1_context["active"] = True
                    mod1_context["current_step"] = "UZUNLUK"
                    current_operation = None
                    return jsonify({
                        "response": MOD1_STEPS["UZUNLUK"],
                        "currentContext": "mod1_update",
                        "showCancelButton": True
                    })

            # Robot seçimi sonrası işlem kontrolü
            if selected_id and not mod1_context["active"] and not coordinate_context["active"]:
                if current_operation == "mod1":
                    mod1_context["active"] = True
                    mod1_context["current_step"] = "UZUNLUK"
                    current_operation = None
                    return jsonify({
                        "response": MOD1_STEPS["UZUNLUK"],
                        "currentContext": "mod1_update",
                        "showCancelButton": True
                    })
                elif current_operation == "coordinate":
                    coordinate_context["active"] = True
                    coordinate_context["current_step"] = "COUNT"
                    coordinate_context["waiting_for_count"] = True
                    current_operation = None
                    return jsonify({
                        "response": "Kaç adet koordinat çifti girmek istiyorsunuz?",
                        "currentContext": "update_coordinates",
                        "showCancelButton": True,
                        "showOptions": True
                    })

            # Koordinat güncelleme kontrolü
            if intents_list and any(intent['intent'] == 'koordinat_guncelleme' for intent in intents_list):
                if not selected_id and not is_robot_selected:
                    current_operation = "coordinate"
                    robots = fetch_robots_info()
                    return jsonify({
                        "response": "Koordinat güncellemesi için önce bir araç seçmelisiniz. Lütfen listeden bir araç seçin:",
                        "currentContext": "robot_sorgulama",
                        "showOptions": True,
                        "showRobots": True,
                        "robots": robots,
                        "showCancelButton": False
                    })
                else:
                    coordinate_context.update({
                        "active": True,
                        "current_step": "COUNT",
                        "waiting_for_count": True,
                        "waiting_for_coordinates": False
                    })
                    current_operation = None
                    return jsonify({
                        "response": "Kaç adet koordinat çifti girmek istiyorsunuz?",
                        "currentContext": "update_coordinates",
                        "showCancelButton": True,
                        "showOptions": True
                    })

            # Mod1 parametrelerini bekliyorsak
            if mod1_context["active"]:
                try:
                    value = float(msg) if mod1_context["current_step"] != "DONUS_ACISI" else int(msg)
                    
                    if mod1_context["current_step"] == "UZUNLUK":
                        mod1_context["parameters"]["siraUzunlugu"] = value
                        mod1_context["current_step"] = "MESAFE"
                        return jsonify({
                            "response": MOD1_STEPS["MESAFE"],
                            "currentContext": "mod1_update",
                            "showCancelButton": True
                        })
                    elif mod1_context["current_step"] == "MESAFE":
                        mod1_context["parameters"]["ikiSiraArasiMesafe"] = value
                        mod1_context["current_step"] = "SIRA_SAYISI"
                        return jsonify({
                            "response": MOD1_STEPS["SIRA_SAYISI"],
                            "currentContext": "mod1_update",
                            "showCancelButton": True
                        })
                    elif mod1_context["current_step"] == "SIRA_SAYISI":
                        mod1_context["parameters"]["toplamSiraSayisi"] = value
                        mod1_context["current_step"] = "DONUS_DERECESI"
                        return jsonify({
                            "response": MOD1_STEPS["DONUS_DERECESI"],
                            "currentContext": "mod1_update",
                            "showCancelButton": True
                        })
                    elif mod1_context["current_step"] == "DONUS_DERECESI":
                        mod1_context["parameters"]["donusDerecesi"] = value
                        mod1_context["current_step"] = "DONUS_ACISI"
                        return jsonify({
                            "response": MOD1_STEPS["DONUS_ACISI"],
                            "currentContext": "mod1_update",
                            "showCancelButton": True
                        })
                    elif mod1_context["current_step"] == "DONUS_ACISI":
                        if value not in [1, 2]:
                            return jsonify({
                                "response": "Lütfen geçerli bir seçim yapın (1: Sağ, 2: Sol)",
                                "currentContext": "mod1_update",
                                "showCancelButton": True
                            })
                        mod1_context["parameters"]["ilkDonusAcisi"] = "Sağ" if value == 1 else "Sol"
                        parameters = mod1_context["parameters"]

                        # Mod1 güncellemesini MongoDB'ye kaydet
                        save_mod1_update(user_id, selected_id, parameters)
                        logger.info(f"Mod1 parametreleri kaydedildi: {parameters}")

                        mod1_context.update({
                            "active": False,
                            "current_step": None,
                            "parameters": {k: None for k in mod1_context["parameters"]}
                        })
                        return jsonify({
                            "response": "Mod1 parametreleri alındı. Güncelleme yapılıyor...",
                            "currentContext": "mod1_update",
                            "mod1Parameters": parameters,
                            "showCancelButton": False
                        })
                except ValueError:
                    return jsonify({
                        "response": "Lütfen geçerli bir sayı girin.",
                        "currentContext": "mod1_update",
                        "showCancelButton": True
                    })

            # Koordinat güncelleme süreci aktifse
            if coordinate_context["active"]:
                if coordinate_context["waiting_for_count"]:
                    try:
                        count = int(msg)
                        if count > 0:
                            coordinate_context.update({
                                "coordinate_count": count,
                                "waiting_for_count": False,
                                "waiting_for_coordinates": True,
                                "current_coordinate": 1,
                                "coordinates": []
                            })
                            return jsonify({
                                "response": f"Lütfen {coordinate_context['current_coordinate']}. koordinat çifti için enlem ve boylamı 'enlem,boylam' formatında girin.",
                                "currentContext": "update_coordinates",
                                "showCancelButton": True,
                                "showOptions": True
                            })
                        return jsonify({
                            "response": "Lütfen 0'dan büyük bir sayı girin.",
                            "currentContext": "update_coordinates",
                            "showCancelButton": True,
                            "showOptions": True
                        })
                    except ValueError:
                        return jsonify({
                            "response": "Lütfen geçerli bir sayı girin.",
                            "currentContext": "update_coordinates",
                            "showCancelButton": True,
                            "showOptions": True
                        })

                elif coordinate_context["waiting_for_coordinates"]:
                    coord_pattern = r'^-?\d+\.?\d*,-?\d+\.?\d*$'
                    if re.match(coord_pattern, msg):
                        try:
                            lat, lng = map(float, msg.split(','))
                            coordinate_context["coordinates"].append({"latitude": lat, "longitude": lng})
                            
                            if len(coordinate_context["coordinates"]) < coordinate_context["coordinate_count"]:
                                coordinate_context["current_coordinate"] += 1
                                return jsonify({
                                    "response": f"Lütfen {coordinate_context['current_coordinate']}. koordinat çifti için enlem ve boylamı 'enlem,boylam' formatında girin.",
                                    "currentContext": "update_coordinates",
                                    "showCancelButton": True,
                                    "showOptions": True
                                })
                            else:
                                coordinates = coordinate_context["coordinates"]

                                # Koordinat güncellemesini MongoDB'ye kaydet
                                save_coordinate_update(user_id, selected_id, coordinates)
                                logger.info(f"Koordinatlar kaydedildi: {coordinates}")

                                save_chat_message(user_id=user_id, message=msg, sender='user', context='update_coordinates')
                                save_chat_message(user_id=user_id, message="Koordinatlar başarıyla güncellendi", sender='bot', context='update_coordinates')

                                # Özet oluştur
                                create_and_save_chat_summary(user_id)


                                coordinate_context.update({
                                    "active": False,
                                    "current_step": None,
                                    "waiting_for_count": False,
                                    "waiting_for_coordinates": False,
                                    "coordinate_count": 0,
                                    "coordinates": [],
                                    "current_coordinate": 0
                                })
                                return jsonify({
                                    "response": "Tüm koordinatlar alındı. Güncelleme yapılıyor...",
                                    "currentContext": "update_coordinates",
                                    "coordinates": coordinates,
                                    "showCancelButton": False,
                                    "showOptions": True
                                })
                        except ValueError:
                            return jsonify({
                                "response": "Geçersiz koordinat formatı. Lütfen 'enlem,boylam' formatında girin. Örnek: 41.0082,28.9784",
                                "currentContext": "update_coordinates",
                                "showCancelButton": True,
                                "showOptions": True
                            })
                    return jsonify({
                        "response": "Geçersiz koordinat formatı. Lütfen 'enlem,boylam' formatında girin. Örnek: 41.0082,28.9784",
                        "currentContext": "update_coordinates",
                        "showCancelButton": True,
                        "showOptions": True
                    })

            # Normal chatbot akışı
            INTENT_THRESHOLD = 0.85  # %85 eşik değeri

            if not intents_list:
                logger.info("Intent listesi boş, tarım kelimesi kontrolü yapılıyor...")
                # Hiç intent bulunamadıysa ve tarımla ilgili kelime varsa
                if any(kelime in msg.lower() for kelime in tarim_kelimeleri):
                    try:
                        # Önce kullanıcı mesajını kaydet
                        save_chat_message(user_id=user_id, message=msg, sender='user', context='gemini_response')
                        
                        # Gemini'den yanıt al
                        response = model.generate_content(
                            f"Sen bir tarım chatbot asistanısın. Sadece tarımla ilgili soruları yanıtla. Soru: {msg}"
                        )
                        
                        # Bot yanıtını kaydet
                        save_chat_message(user_id=user_id, message=response.text, sender='bot', context='gemini_response')

                        # Özet oluştur ve kaydet
                        create_and_save_chat_summary(user_id)

                        return jsonify({
                            'response': response.text,
                            'currentContext': "gemini_response",
                            'showCancelButton': False 
                        })
                       
                    except Exception as e:
                        logger.error(f"Gemini API hatası: {str(e)}")
                        return jsonify({
                            'response': 'Üzgünüm, bu soruyu şu anda yanıtlayamıyorum.',
                            'currentContext': "error",
                            'showCancelButton': False 
                        })
            else:
                # Intent bulunduysa, probability kontrolü yap
                highest_intent = intents_list[0]
                probability = float(highest_intent['probability'])
                
                if probability >= INTENT_THRESHOLD:
                    try:
                        # Eğer probability yüksekse, intent sistemini kullan
                        response, show_options = get_response(intents_list, intents, user_response=msg, selected_id=selected_id)

                        # Önce mesajları kaydet
                        save_chat_message(user_id=user_id, message=msg, sender='user', context=current_context)
                        save_chat_message(user_id=user_id, message=response, sender='bot', context=current_context)

                        # Özet oluştur ve kaydet
                        create_and_save_chat_summary(user_id)

                        return jsonify({
                            'response': response,
                            'showOptions': show_options,
                            'currentContext': current_context,
                            'showCancelButton': False
                        })

                    except Exception as e:
                        logger.error(f"Intent işleme hatası: {str(e)}")
                        return jsonify({
                            'response': 'Üzgünüm, bir hata oluştu.',
                            'currentContext': "error",
                            'showCancelButton': False
                        })

                else:
    # Probability düşükse ve tarımla ilgili kelime varsa Gemini'ye yönlendir
                    if any(kelime in msg.lower() for kelime in tarim_kelimeleri):
                        try:
                            # Gemini'den yanıt al
                            response = model.generate_content(
                                f"Sen bir tarım chatbot asistanısın. Sadece tarımla ilgili soruları yanıtla. Soru: {msg}"
                            )
                            
                            # Mesajları kaydet
                            save_chat_message(user_id=user_id, message=msg, sender='user', context='gemini_response')
                            save_chat_message(user_id=user_id, message=response.text, sender='bot', context='gemini_response')

                            # Özet oluştur
                            create_and_save_chat_summary(user_id)
                            
                            return jsonify({
                                'response': response.text,
                                'currentContext': "gemini_response",
                                'showCancelButton': False
                            })

                        except Exception as e:
                            logger.error(f"Gemini API hatası: {str(e)}")
                            return jsonify({
                                'response': 'Üzgünüm, bu soruyu şu anda yanıtlayamıyorum.',
                                'currentContext': "error",
                                'showCancelButton': False
                            })

                        

                    else:
                        # Tarımla ilgili kelime de yoksa
                        logger.info("Tarımla ilgili kelime bulunamadı, red cevabı dönülüyor...")
                        return jsonify({
                            'response': 'Bu konu hakkında yardımcı olamıyorum. Ben sadece tarımla ilgili konularda uzmanım.',
                            'currentContext': "not_agricultural",
                            'showCancelButton': False
                        })

        except Exception as e:
            logger.error("Beklenmeyen hata oluştu.", exc_info=True)
            return jsonify({'response': 'Bir hata oluştu. Lütfen tekrar deneyin.'}), 500
    else:
        logger.debug("Geçersiz Content-Type başlığı")
        return jsonify({'error': 'Invalid Content-Type'}), 400
def create_and_save_chat_summary(user_id, chat_history=None):
    """Sohbet geçmişini alır, özetler ve kaydeder"""
    try:
        if chat_history is None:
            chat_history = get_chat_history(user_id, hours=1)
        
        logger.info(f"Sohbet geçmişi alındı: {len(chat_history)} mesaj bulundu")
        
        if chat_history:
            chat_text = "\n".join([
                f"{'Kullanıcı' if message.get('sender')=='user' else 'Bot'}: {message.get('message', '')}"
                for message in chat_history
            ])
            logger.info(f"Oluşturulan chat_text: {chat_text}")

            prompt = f"""Sen bir tarım robotu chatbot'usun. Aşağıdaki sohbet geçmişini özetle.
            ÖZETLEME KURALLARI:
            1. SADECE bu sohbette geçen konuları özetle
            2. Sohbette geçmeyen hiçbir konuyu ekleme
            3. Her kategoriyi sadece konuşulduysa ekle

            ÖZET FORMATI:
            1. Robot Komutları:
            - Mod1 güncellemeleri: [varsa detaylar]
            - Koordinat güncellemeleri: [varsa detaylar]
            - Diğer robot komutları: [varsa detaylar]

            2. Tarımsal Konular:
            - Sorulan sorular: [varsa detaylar]
            - Verilen cevaplar: [varsa detaylar]
            - Alınan kararlar: [varsa detaylar]

            3. Önemli Notlar:
            - Karşılaşılan sorunlar: [varsa detaylar]
            - Çözüm önerileri: [varsa detaylar]

            Sohbet geçmişi:
            {chat_text}

            NOT: Eğer bir kategori hakkında konuşma geçmediyse, o kategoriyi özete ekleme!
            """
            
            summary_response = model.generate_content(prompt)
            summary = summary_response.text
            logger.info(f"Gemini'den alınan özet: {summary}")

            # Özet içeriği kontrolü
            relevant_keywords = [
                'mod1', 'koordinat', 'robot', 'tarım', 'sera', 'sulama', 
                'bitki', 'hasat', 'tohum', 'gübre', 'ilaçlama', 'toprak'
            ]

            if any(keyword in summary.lower() for keyword in relevant_keywords):
                save_chat_summary(
                    user_id=user_id,
                    summary=summary,
                    start_time=chat_history[0]['timestamp'] if chat_history else None,
                    end_time=chat_history[-1]['timestamp'] if chat_history else None
                )
                logger.info("Özet başarıyla kaydedildi")
            else:
                logger.warning("Özet alakasız görünüyor, kaydedilmedi")

    except Exception as e:
        logger.error(f"Özet oluşturma ve kaydetme hatası: {str(e)}")
def fetch_robots_info():
    """Tüm robotları fetch edip bilgilerini döner."""
    url = "https://localhost:44315/api/UgvRobot"
    try:
        response = requests.get(url, verify=False, timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Robot listesi alınamadı. Durum Kodu: {response.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"API bağlantı hatası: {e}")
        return []

@app.route("/get_robots", methods=['GET'])
def get_robots():
    """Tüm robotları listeleyen API çağrısı."""
    url = "https://localhost:44315/api/UgvRobot"
    try:
        response = requests.get(url, verify=False, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            logger.error(f"Robot listesi alınamadı. Durum Kodu: {response.status_code}")
            return jsonify({'error': 'Robot listesi alınamadı'}), response.status_code
    except requests.exceptions.Timeout:
        logger.error(f"API çağrısı zaman aşımına uğradı. URL: {url}")
        return jsonify({'error': 'API çağrısı zaman aşımına uğradı.'}), 408
    except requests.exceptions.RequestException as e:
        logger.error(f"API bağlantı hatası: {e}")
        return jsonify({'error': f"API bağlantı hatası: {e}"}), 500

@app.route("/get_robot_info/<robot_id>", methods=['GET'])
def get_robot_info(robot_id):
    """Belirli bir robotun bilgilerini getiren API çağrısı."""
    url = f"https://localhost:44315/api/UgvRobot/{robot_id}"
    try:
        response = requests.get(url, verify=False, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            logger.error(f"Robot bilgileri alınamadı. Durum Kodu: {response.status_code}")
            return jsonify({'error': 'Robot bilgileri alınamadı'}), response.status_code
    except requests.exceptions.Timeout:
        logger.error(f"API çağrısı zaman aşımına uğradı. URL: {url}")
        return jsonify({'error': 'API çağrısı zaman aşımına uğradı.'}), 408
    except requests.exceptions.RequestException as e:
        logger.error(f"API bağlantı hatası: {e}")
        return jsonify({'error': f"API bağlantı hatası: {e}"}), 500

@app.route("/api/UgvRobot/update-mod2/<string:car_no>", methods=['PATCH'])
def update_coordinates(car_no):
    """Seçilen robotun koordinatlarını günceller."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Veri gönderilmedi"}), 400

        # Koordinatları mod2 formatına dönüştür
        mod2_data = data.get('mod2')
        if not mod2_data:
            return jsonify({"error": "Koordinat verisi bulunamadı"}), 400

        # API'ye gönderilecek veriyi hazırla
        update_data = {
            "siraUzunlugu": data.get('siraUzunlugu', 0),
            "ikiSiraArasiMesafe": data.get('ikiSiraArasiMesafe', 0),
            "toplamSiraSayisi": data.get('toplamSiraSayisi', 0),
            "donusDerecesi": data.get('donusDerecesi', 0),
            "ilkDonusAcisi": data.get('ilkDonusAcisi', "Sol"),
            "mod2": mod2_data
        }

        # API çağrısı yap
        url = f"https://localhost:44315/api/UgvRobot/update-mod2/{car_no}"
        response = requests.patch(url, json=update_data, verify=False)
        
        if response.status_code == 200:
            return jsonify({"message": "Koordinatlar başarıyla güncellendi."}), 200
        else:
            return jsonify({"error": "Koordinat güncellemesi başarısız oldu."}), response.status_code

    except Exception as e:
        logger.error(f"Koordinat güncelleme hatası: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)




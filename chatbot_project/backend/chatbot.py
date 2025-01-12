import random
import numpy as np
import re
from model import load_model
from preprocess import bag_of_words
from colored_logger import get_colored_logger
import requests

# Logger'ı başlat
logger = get_colored_logger()
model, words, classes = load_model()
current_context = ""
conversation_step = {}

# Robotları listelemek için API fonksiyonu
def get_robots():
    """Tüm robotları listeleyen API çağrısı."""
    url = "https://localhost:44315/api/UgvRobot"
    try:
        response = requests.get(url, verify=False, timeout=5)  # Timeout eklendi
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Robot listesi alınamadı. Durum Kodu: {response.status_code}")
            return None
    except requests.exceptions.Timeout:
        logger.error(f"API çağrısı zaman aşımına uğradı. URL: {url}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"API bağlantı hatası: {e}")
        return None

# Robot verisini almak için API çağrısı
def get_robot_data(id):
    """Belirli bir robotun verilerini getiren API çağrısı."""
    if not id:
        logger.error("Geçersiz robot ID: None veya boş.")
        return {"error": "Geçersiz robot ID."}
    
    url = f"https://localhost:44315/api/UgvRobot/{id}"
    try:
        response = requests.get(url, verify=False, timeout=5)  # Timeout eklendi
        if response.status_code == 200:
            data = response.json()
            logger.warning(f"Robot verisi: {data}")
            if not data:
                logger.warning(f"Robot verisi bulunamadı. ID: {id}")
                return {"error": "Veri bulunamadı"}
            return data
        else:
            logger.error(f"Robot verisi alınamadı. Durum Kodu: {response.status_code}")
            return {"error": f"Robot verisi alınamadı. Durum Kodu: {response.status_code}"}
    except requests.exceptions.Timeout:
        logger.error(f"API çağrısı zaman aşımına uğradı. URL: {url}")
        return {"error": "API çağrısı zaman aşımına uğradı."}
    except requests.exceptions.RequestException as e:
        logger.error(f"Robot API bağlantı hatası: {e}")
        return {"error": f"Robot API bağlantı hatası: {e}"}

def get_response(intents_list, intent_json, user_response=None, selected_id=None):
    global current_context

    if not intents_list:
        logger.warning("Intent listesi boş, cevap üretilemiyor.")
        return "Ne dediğinizi anlayamadım.", False

    # En yüksek olasılıklı intent'i seç
    tag = intents_list[0]['intent']
    logger.info(f"Tespit edilen intent: {tag}")
    
    # Mod1 güncelleme kontrolü
    if tag == "mod1_guncelleme":
        robot_info = get_robots()
        if robot_info:
            logger.info("Mod1 güncelleme için robot listesi alındı")
            return "Lütfen mod1 parametrelerini güncellemek istediğiniz aracı seçin:", True
        else:
            logger.error("Robot listesi alınamadı")
            return "Robot listesi alınamadı. Lütfen tekrar deneyin.", False

    intent_data = next((i for i in intent_json['intents'] if i['tag'] == tag), None)
    if not intent_data:
        logger.warning(f"'{tag}' etiketine sahip intent bulunamadı.")
        return "Ne dediğinizi anlayamadım.", False

    # Değişkenlerin işlenmesi
    updated_responses = []
    if "variables" in intent_data:
        # Seçilen robot verilerini al, eğer selected_id verilmişse
        selected_robot = {}
        if selected_id:
            selected_robot = get_robot_data(selected_id)
            if "error" in selected_robot:
                logger.error(f"Robot verisi hatası: {selected_robot['error']}")
                return selected_robot["error"], False
        
        variables = intent_data["variables"]
        # Yanıtları dinamik olarak oluştur
        for response in intent_data["responses"]:
            updated_response = response
            for key, value in variables.items():
                if value in selected_robot:
                    robot_value = selected_robot.get(value, "Bilinmiyor")
                    updated_response = updated_response.replace(f"{{{key}}}", str(robot_value))
                else:
                    logger.warning(f"Değişken '{key}' robot verisinde bulunamadı.")
            updated_responses.append(updated_response)
        
        logger.debug(f"Dinamik olarak oluşturulan yanıtlar: {updated_responses}")
    else:
        updated_responses = intent_data["responses"]

    # Yanıt seçimi
    if not updated_responses:
        logger.error("Intent için güncellenmiş veya orijinal bir yanıt bulunamadı.")
        return "Yanıt verilemiyor.", False

    # Güncel bağlamı ayarla (varsa)
    current_context = intent_data.get('context_set', '')
    logger.debug(f"Yeni context: {current_context}")

    # İlk yanıtı döndür
    response = updated_responses[0]
    logger.info(f"Kullanıcı intent: {tag}, Seçilen robot ID: {selected_id}, Yanıt: {response}")
    
    # Mod1 güncelleme veya robot seçimi durumlarında showOptions'ı True yap
    show_options = tag in ["mod1_guncelleme", "robot_secimi"] or current_context in ["mod1_update", "waiting_mod1_parameters"]
    
    return response, show_options

# Cümleyi temizler
def clean_sentence(sentence):
    """Cümleyi küçük harfe çevirir, sayıları ve noktalama işaretlerini kaldırır."""
    sentence = sentence.lower()
    sentence = re.sub(r'\d+', '', sentence)
    sentence = re.sub(r'[^\w\s]', '', sentence)
    return sentence

# Sınıflandırma yapar
def predict_class(sentence):
    """Verilen bir cümleyi sınıflandırır."""
    try:
        cleaned_sentence = clean_sentence(sentence)
        bow = bag_of_words(cleaned_sentence, words)  # Kelime torbası

        res = model.predict(np.array([bow]))[0]
        ERROR_THRESHOLD = 0.25
        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
        
        if not results:
            logger.warning("Modelin tahmin sonucu boş.")
            return []

        results.sort(key=lambda x: x[1], reverse=True)
        return_list = [{'intent': classes[r[0]], 'probability': str(r[1])} for r in results]
        logger.info(f"Predict class results: {return_list}")

        return return_list

    except Exception as e:
        logger.error(f"predict_class Hatası: {e}")
def get_response(intents_list, intent_json, user_response=None, selected_id=None):
    global current_context

    if not intents_list:
        logger.warning("Intent listesi boş, cevap üretilemiyor.")
        return "Ne dediğinizi anlayamadım.", False

    # En yüksek olasılıklı intent'i seç
    tag = intents_list[0]['intent']
    intent_data = next((i for i in intent_json['intents'] if i['tag'] == tag), None)
    if not intent_data:
        logger.warning(f"'{tag}' etiketine sahip intent bulunamadı.")
        return "Ne dediğinizi anlayamadım.", False

    # Değişkenlerin işlenmesi
    updated_responses = []
    if "variables" in intent_data:
        # Seçilen robot verilerini al, eğer selected_id verilmişse
        selected_robot = {}
        if selected_id:
            selected_robot = get_robot_data(selected_id)
            if "error" in selected_robot:
                logger.error(f"Robot verisi hatası: {selected_robot['error']}")
                return selected_robot["error"], False
        
        variables = intent_data["variables"]
        # Yanıtları dinamik olarak oluştur
        for response in intent_data["responses"]:  # Orijinal yanıtları koruyarak güncelle
            updated_response = response
            for key, value in variables.items():  # Değişkenleri yerleştir
                if value in selected_robot:
                    robot_value = selected_robot.get(value, "Bilinmiyor")
                    updated_response = updated_response.replace(f"{{{key}}}", str(robot_value))
                else:
                    logger.warning(f"Değişken '{key}' robot verisinde bulunamadı.")
            updated_responses.append(updated_response)
        
        logger.debug(f"Dinamik olarak oluşturulan yanıtlar: {updated_responses}")
    else:
        # Eğer değişken yoksa orijinal yanıtları kullan
        updated_responses = intent_data["responses"]

    # Güncel bağlamı ayarla (varsa)
    current_context = intent_data.get('context_set', current_context)

    # Eğer intent 'update_coordinates' ise robotları fetch et
    if tag == "update_coordinates":
        robot_info = get_robots()  # Robotları fetch et
        return "Koordinatlar güncellendi. Robot bilgileri yüklendi.", True

    # İlk yanıtı döndür (tek yanıt varsayımıyla)
    response = updated_responses[0]
    logger.info(f"Kullanıcı intent: {tag}, Seçilen robot ID: {selected_id}, Yanıt: {response}")
    return response, False


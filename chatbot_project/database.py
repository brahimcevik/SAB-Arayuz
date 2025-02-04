from pymongo import MongoClient
from datetime import datetime, timedelta
import logging

# Logger yapılandırması
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Console handler ekleme
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Formatter ekleme
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Handler'ı logger'a ekleme
logger.addHandler(console_handler)
# MongoDB bağlantısı
client = MongoClient('mongodb://localhost:27017/')
db = client['chatbot_db']

def save_chat_message(user_id, message, sender='user', context=None):
    """Sohbet mesajını veritabanına kaydeder"""
    chat_messages = db.chat_messages
    message_doc = {
        'user_id': user_id,
        'message': message,
        'sender': sender,
        'context': context,  # Opsiyonel context parametresi
        'timestamp': datetime.utcnow()
    }
    return chat_messages.insert_one(message_doc)

def save_chat_summary(user_id, summary, start_time=None, end_time=None):
    """Sohbet özetini kaydeder"""
    summary_collection = db['chat_summaries']
    summary_collection.insert_one({
        'user_id': user_id,
        'summary': summary,
        'start_time': start_time,
        'end_time': end_time,
        'created_at': datetime.now()
    })

def get_chat_history(user_id, hours=1):
    """Belirli bir süre içindeki sohbet geçmişini getirir"""
    try:
        chat_messages = db.chat_messages
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        messages = list(chat_messages.find({
            'user_id': user_id,
            'timestamp': {'$gte': cutoff_time}
        }).sort('timestamp', 1))
        
        logger.info(f"Kullanıcı {user_id} için {len(messages)} mesaj bulundu")
        return messages
    except Exception as e:
        logger.error(f"Sohbet geçmişi alınırken hata: {str(e)}")
        return []

def save_mod1_update(user_id, robot_id, parameters):
    """Mod1 güncellemelerini kaydeder"""
    robot_collection = db['robot_interactions']
    robot_collection.insert_one({
        'user_id': user_id,
        'robot_id': robot_id,
        'type': 'mod1',
        'parameters': parameters,
        'timestamp': datetime.now()
    })

def save_coordinate_update(user_id, robot_id, coordinates):
    """Koordinat güncellemelerini kaydeder"""
    robot_collection = db['robot_interactions']
    robot_collection.insert_one({
        'user_id': user_id,
        'robot_id': robot_id,
        'type': 'coordinate',
        'coordinates': coordinates,
        'timestamp': datetime.now()
    })

def get_user_summaries(user_id):
    """Kullanıcının tüm özetlerini getirir"""
    summary_collection = db['chat_summaries']
    return list(summary_collection.find({
        'user_id': user_id
    }).sort('created_at', -1))
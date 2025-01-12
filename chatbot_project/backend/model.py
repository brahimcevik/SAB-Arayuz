# model.py
# Eğitilmiş modeli yükleyen ve tahmin işlemlerini gerçekleştiren fonksiyonlar.

import os
import pickle
import tensorflow as tf

current_dir = os.path.dirname(os.path.abspath(__file__))
model_file_path = os.path.join(current_dir, 'chatbotmodel.keras')
words_file_path = os.path.join(current_dir, 'words.pkl')
classes_file_path = os.path.join(current_dir, 'classes.pkl')

def load_model():
    """Eğitilmiş modeli yükler ve geri döner."""
    model = tf.keras.models.load_model(model_file_path)
    with open(words_file_path, 'rb') as wordFile:
        words = pickle.load(wordFile)
    with open(classes_file_path, 'rb') as classesFile:
        classes = pickle.load(classesFile)
    return model, words, classes

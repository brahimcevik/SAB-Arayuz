# preprocess.py
# Kullanıcı girişini ön işleyen ve kelime torbasını oluşturan fonksiyonlar.

import nltk
import numpy as np
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

def clean_up_sentence(sentence):
    """Cümleyi temizler ve kök haline getirir."""
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence, words):
    """Cümledeki kelimeleri kelime torbasına dönüştürür."""
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

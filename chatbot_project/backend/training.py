import re
import random
import json
import pickle
import numpy as np
import tensorflow as tf
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from tensorflow.keras.callbacks import EarlyStopping # type: ignore

# Türkçe destekleyen lemmatizer veya stemming aracını kullanmak faydalı olabilir
lemmatizer = WordNetLemmatizer()
nltk.download('stopwords')
stop_words = set(stopwords.words("turkish"))

# intents.json dosyasını yükleme
with open('c:/Users/ibrah/OneDrive/Belgeler/GitHub/SAB-Arayuz/chatbot_project/backend/intents.json', encoding='utf-8') as file:
    intents = json.load(file)

words = []
classes = []
documents = []

def clean_text(text):
    """Metni temizler, küçük harfe çevirir ve Türkçe stopwords kelimeleri temizler."""
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.lower()
    text = " ".join([word for word in text.split() if word not in stop_words])
    return text

# Veriyi işleme ve yapıyı oluşturma
for intent in intents['intents']:
    for pattern in intent['patterns']:
        cleaned_pattern = clean_text(pattern)
        word_list = nltk.word_tokenize(cleaned_pattern)
        words.extend(word_list)
        documents.append((word_list, intent['tag']))

        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Tüm kelimeleri lemmatizer ile köke indir ve tekrarları kaldır
words = sorted(set([lemmatizer.lemmatize(word) for word in words]))
classes = sorted(set(classes))

# Kelimeler ve sınıfları dosyaya kaydet
with open('words.pkl', 'wb') as file:
    pickle.dump(words, file)
with open('classes.pkl', 'wb') as file:
    pickle.dump(classes, file)

# Eğitim verisini hazırlama
training = []
output_empty = [0] * len(classes)

for document in documents:
    bag = []
    word_patterns = document[0]
    word_patterns = [lemmatizer.lemmatize(word) for word in word_patterns]
    bag = [1 if word in word_patterns else 0 for word in words]

    # Çıkış sınıfını ayarla (one-hot encoding)
    output_row = list(output_empty)
    output_row[classes.index(document[1])] = 1
    training.append(bag + output_row)

# Veriyi karıştır ve array’e dönüştür
random.shuffle(training)
training = np.array(training, dtype=object)

# Eğitim ve çıkış verisini ayır
trainX = np.array(training[:, :len(words)], dtype=np.float32)
trainY = np.array(training[:, len(words):], dtype=np.float32)

# Modeli tanımla ve katmanları düzenle
# tensorflow kullanılarak çok katmanlı bir yapay sinir ağı modeli oluşturulmuştur
# Model 128 ve 64 nöronlu iki gizli katmana ve softmax aktivasyon fonksiyonlu bir çıktı katmanına sahip. 
# Model categorical_crossentropy kaybı ile Adam optimizasyon algoritması kullanılarak derleniyor.

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, input_shape=(len(trainX[0]),), activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(len(trainY[0]), activation='softmax')
])

# Adam optimizasyonu ile derleme
model.compile(loss='categorical_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), metrics=['accuracy'])

# Erken durdurma callback'i
# Model, erken durdurma (EarlyStopping) ile birlikte 500 epoch’a kadar eğitiliyor. 
# Bu, modelin doğrulama hatasını izleyerek gereksiz yere aşırı öğrenmenin önüne geçiyor.
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Modeli eğit
hist = model.fit(trainX, trainY, epochs=500, batch_size=8, validation_split=0.2, callbacks=[early_stop], verbose=1)

# Eğitilen modeli kaydet
model.save('chatbotmodel.keras')

print('Temizleme ve eğitim işlemi tamamlandı!')

# Eğitim sürecini görselleştir
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(hist.history['loss'], label='Training Loss')
plt.plot(hist.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Training and Validation Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(hist.history['accuracy'], label='Training Accuracy')
plt.plot(hist.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.title('Training and Validation Accuracy')
plt.legend()

plt.show()

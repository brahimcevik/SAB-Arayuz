import requests
import time
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import warnings

# SSL uyarılarını gizle
warnings.simplefilter('ignore', InsecureRequestWarning)

# Backend URL'sini tanımlayın
backend_url = "https://localhost:44315/"

def send_patch_request(url, post_data):
    """Veri ile PATCH isteği gönderir"""
    response = requests.patch(url, json=post_data, verify=False)
    if response.status_code == 200:  # 200 OK, başarılı işlem anlamına gelir
        print(f"Veri başarıyla {url} adresine gönderildi!")
    # `204 No Content` durum kodunu da başarılı olarak kabul edebilirsiniz
    elif response.status_code == 204:
        print(f"Veri başarıyla {url} adresine gönderildi, ancak içerik yok.")
    else:
        print(response.text)  # Hata yanıtını yazdırır, varsa

def update_online_status(no_value, new_online_status):
    """OnlineStatus değerini günceller"""
    url = f"{backend_url}api/UgvRobot/update-online-status/{no_value}"
    
    # Gönderilecek veri
    data = {
        "onlineStatus": new_online_status,  # True ya da False
        "Mod2": "YourMod2Value",  # Gerçek Mod2 değeri ile değiştirin
        "IlkDonusAcisi": "YourIlkDonusAcisiValue"  # Gerçek IlkDonusAcisi değeri ile değiştirin
    }
    send_patch_request(url, data)

# Ana döngü
while True:
    no_value = "0"  # Gerçek 'no' değeri ile değiştirin
    
    # Kullanıcıdan onlineStatus değeri için giriş al
    user_input = input("OnlineStatus değeri için 'True' ya da 'False' girin (çıkmak için 'exit'): ").strip().lower()
    
    if user_input == 'exit':
        print("Çıkılıyor...")
        break
    
    if user_input in ['true', 'false']:
        new_online_status = user_input == 'true'
        update_online_status(no_value, new_online_status)  # Kullanıcının seçtiği değeri kullanarak güncelle
    else:
        print("Geçersiz giriş. Lütfen 'True' veya 'False' girin.")
    
    time.sleep(60)  # 60 saniyede bir tekrar eder

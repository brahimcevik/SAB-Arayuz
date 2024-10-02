import requests
import time
import random

# Backend URL'sini tanımlayın
backend_url = "https://localhost:44315/"

def send_patch_request(url, post_data):
    """Veri ile PATCH isteği gönderir"""
    response = requests.patch(url, json=post_data, verify=False)
    if response.status_code in [200, 204]:  # 200 OK veya 204 No Content başarılı işlem anlamına gelir
        print(f"Veri başarıyla {url} adresine gönderildi!")
    else:
        print(f"Veriyi {url} adresine gönderme başarısız. Durum kodu: {response.status_code}")
        print(response.text)  # Hata yanıtını yazdırır, varsa

def update_online_status(no_value, online_status):
    url = f"{backend_url}api/UgvRobot/update-online-status/{no_value}"
    data = {
        "siraUzunlugu": 0,
        "ikiSiraArasiMesafe": 0,
        "toplamSiraSayisi": 0,
        "donusDerecesi": 0,
        "ilkDonusAcisi": "string",
        "mod2": "string",
        "onlineStatus": online_status
    }
    send_patch_request(url, data)

no_value = "0"  # Gerçek 'no' değeri ile değiştirin

while True:
    # Rastgele True veya False değeri üretir
    random_boolean = random.choice([True, False])
    update_online_status(no_value, random_boolean)  # Online durumunu günceller
    
    time.sleep(5)  # 10 saniye bekle

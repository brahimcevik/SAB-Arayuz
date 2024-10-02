import requests
import time
from datetime import datetime

# Backend URL'sini tanımlayın
backend_url = "https://localhost:44315/"

def send_patch_request(url, post_data):
    """Veri ile PATCH isteği gönderir"""
    response = requests.patch(url, json=post_data, verify=False)
    if response.status_code == 200:  # 200 OK, başarılı işlem anlamına gelir
        print(f"Veri başarıyla {url} adresine gönderildi!")
    else:
        print(f"Veriyi {url} adresine gönderme başarısız. Durum kodu: {response.status_code}")
        print(response.text)  # Hata yanıtını yazdırır, varsa

def update_mission(no_value, new_mission):
    url = f"{backend_url}api/UgvRobot/update-mission/{no_value}"
    data = {"newMission": new_mission}
    send_patch_request(url, data)

def update_herbicide(no_value, new_herbicide):
    url = f"{backend_url}api/UgvRobot/update-herbicide/{no_value}"
    data = {"newHerbicide": new_herbicide}
    send_patch_request(url, data)

def update_distance(no_value, new_distance):
    url = f"{backend_url}api/UgvRobot/update-distance/{no_value}"
    data = {"newDistance": new_distance}
    send_patch_request(url, data)

def update_speed(no_value, new_speed):
    url = f"{backend_url}api/UgvRobot/update-speed/{no_value}"
    data = {"newSpeed": new_speed}
    send_patch_request(url, data)

def update_info_date(no_value, new_info_date):
    url = f"{backend_url}api/UgvRobot/update-info-date/{no_value}"
    data = {"newInfoDate": new_info_date}
    send_patch_request(url, data)

def update_location(no_value, car_loc, car_lat, car_long):
    url = f"{backend_url}api/UgvRobot/update-location/{no_value}"
    data = {
        "carLoc": car_loc,
        "carLat": car_lat,
        "carLong": car_long
    }
    send_patch_request(url, data)


def get_current_formatted_datetime():
    """Şu anki tarihi ve saati 'Tarih ve Saat' formatında döndürür"""
    now = datetime.now()
    return now.strftime("%d-%m-%Y Tarih ve %H:%M:%S Saat")

while True:
    no_value = "0"  # Gerçek 'no' değeri ile değiştirin

    # Her özelliği ayrı ayrı güncelleyin
    update_mission(no_value, "Yeni görev")
    update_herbicide(no_value, 120.5)
    update_distance(no_value, 150.0)
    update_info_date(no_value, get_current_formatted_datetime())
    update_location(no_value, "Yeni Lokasyon", 37.7749, -122.4194)
    update_speed(no_value,88)
    
    time.sleep(60)
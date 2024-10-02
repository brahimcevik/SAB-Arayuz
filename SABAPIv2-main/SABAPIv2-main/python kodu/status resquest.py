import requests
import urllib3

# Uyarıyı bastır
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Backend URL'sini tanımlayın
backend_url = "https://localhost:44315/"

def send_get_request(url):
    """GET isteği gönderir ve yanıtı döndürür"""
    response = requests.get(url, verify=False)
    if response.status_code == 200:  # 200 OK, başarılı işlem anlamına gelir
        return response.json()
    else:
        print(f"Veriyi {url} adresinden alma başarısız. Durum kodu: {response.status_code}")
        print(response.text)  # Hata yanıtını yazdırır, varsa
        return None

def get_robot_mod_info(no_value):
    url = f"{backend_url}api/UgvRobot/mod/{no_value}"
    data = send_get_request(url)

    if data:
        # Sadece status değerini yazdır
        status = data.get("status")
        print("Status Değeri:", status)
    else:
        print("Veri alınamadı.")

# Test
no_value = "0"  # Gerçek 'no' değeri ile değiştirin 
get_robot_mod_info(no_value)

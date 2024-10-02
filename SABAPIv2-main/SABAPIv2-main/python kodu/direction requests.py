import requests
import json

backend_url = "https://localhost:44315/"

def send_get_request(url):
    """GET isteği gönderir ve yanıtı JSON olarak döndürür"""
    try:
        response = requests.get(url, verify=False)
        response.raise_for_status()  # HTTP hatalarını kontrol eder
        return response.json()
    except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
        print(f"İstek başarısız oldu: {e}")
        return None

def get_robot_direction_info(no_value):
    url = f"{backend_url}api/UgvRobot/mod/{no_value}"
    data = send_get_request(url)
    
    if data:
        direction_list = json.loads(data.get("direction", "[]"))  # Stringi listeye dönüştür
        if isinstance(direction_list, list):
            print("direction tüm elemanları:")
            for item in direction_list:
                print(item)  # Her bir elemanı ayrı satırda yazdır

        else:
            print("direction geçerli bir liste değil.")
    else:
        print("Veri alınamadı.")

    
    print("direction ilk elemanı:", direction_list[0])

# Test
get_robot_direction_info("0")

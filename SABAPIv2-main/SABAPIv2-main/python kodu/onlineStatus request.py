import requests
import time
import random

# Backend URL'sini tanımlayın
backend_url = "https://localhost:44315/"

def get_current_status(no_value):
    """Mevcut online status değerini alır"""
    try:
        # Önce tüm robotları al
        response = requests.get(f"{backend_url}api/UgvRobot", verify=False)
        if response.status_code == 200:
            robots = response.json()
            # No değerine göre robotu bul
            robot = next((r for r in robots if str(r.get('no')) == str(no_value)), None)
            if robot:
                return robot.get('onlineStatus', 'false,false,false,false')
        return 'false,false,false,false'
    except Exception as e:
        print(f"Mevcut durum alınırken hata oluştu: {e}")
        return 'false,false,false,false'

def send_patch_request(url, post_data):
    """Veri ile PATCH isteği gönderir"""
    try:
        response = requests.patch(url, json=post_data, verify=False)
        if response.status_code in [200, 204]:
            print(f"Veri başarıyla {url} adresine gönderildi!")
        else:
            print(f"Veriyi {url} adresine gönderme başarısız. Durum kodu: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"İstek gönderilirken hata oluştu: {e}")

def update_online_status(no_value):
    """Online status'u günceller, sadece ilk elemanı değiştirir"""
    # Mevcut durumu al
    current_status = get_current_status(no_value)
    status_array = current_status.split(',')
    
    # Sadece ilk elemanı rastgele değiştir
    status_array[0] = random.choice(["true", "false"])
    
    # Yeni status string'ini oluştur
    new_status = ','.join(status_array)
    
    url = f"{backend_url}api/UgvRobot/update-online-status/{no_value}"
    data = {
        "onlineStatus": new_status  # Sadece onlineStatus gönder
    }
    send_patch_request(url, data)
    print(f"Güncellenen status: {new_status}")

def main():
    no_value = "1"  # Robot numarası
    print("Robot durum güncelleyici başlatıldı...")
    
    while True:
        try:
            update_online_status(no_value)
            time.sleep(5)
        except Exception as e:
            print(f"Döngüde hata oluştu: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()
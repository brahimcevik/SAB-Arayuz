import requests
import time
import urllib3

# SSL sertifika doğrulamasını devre dışı bırak (geliştirme ortamı için)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Backend URL'sini tanımla
backend_url = "https://localhost:44315/"

def get_current_status(no_value):
    """Mevcut online status değerini alır"""
    try:
        # Önce tüm robotları al
        response = requests.get(
            f"{backend_url}api/UgvRobot", 
            verify=False,
            headers={'Content-Type': 'application/json'}
        )
        
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

def update_online_status(no_value):
    """Online status'u günceller, sadece ilk elemanı değiştirir"""
    try:
        # Mevcut durumu al
        current_status = get_current_status(no_value)
        status_array = current_status.split(',')
        
        # Array'i 4 elemana tamamla
        while len(status_array) < 4:
            status_array.append("false")
        
        # Sadece ilk elemanı true olarak ayarla (robot çalışıyor sinyali)
        status_array[0] = "true"
        
        # Yeni status string'ini oluştur
        new_status = ','.join(status_array)
        
        # PATCH isteği için URL ve data
        url = f"{backend_url}api/UgvRobot/update-online-status/{no_value}"
        data = {
            "onlineStatus": new_status,
            "siraUzunlugu": 0,
            "ikiSiraArasiMesafe": 0,
            "toplamSiraSayisi": 0,
            "donusDerecesi": 0,
            "ilkDonusAcisi": "0",
            "mod2": "default",
            "status": False
        }
        
        # PATCH isteğini gönder
        response = requests.patch(
            url,
            json=data,
            verify=False,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code in [200, 204]:
            print(f"Online status başarıyla güncellendi: {new_status}")
        else:
            print(f"Online status güncellenirken hata: HTTP {response.status_code}")
            print(f"Sunucu yanıtı: {response.text}")
            
    except Exception as e:
        print(f"Status güncellenirken hata: {e}")

def main():
    no_value = "1"  # Robot numarası
    print("Robot durum güncelleyici başlatıldı...")
    
    while True:
        try:
            update_online_status(no_value)
            time.sleep(5)  # 5 saniye bekle
        except Exception as e:
            print(f"Döngüde hata oluştu: {e}")
            time.sleep(10)  # Hata durumunda 10 saniye bekle

if __name__ == "__main__":
    main() 
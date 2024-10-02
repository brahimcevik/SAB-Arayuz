import requests
import json  # JSON verisini işlemek için gerekli

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
        mod2_str = data.get("mod2", "[]")  # mod2'yi al, yoksa boş bir liste stringi dön
        mod2_list = json.loads(mod2_str)  # Stringi bir listeye dönüştür
        
        # Tüm elemanları yazdır
        if isinstance(mod2_list, list):
            print("mod2'nin tüm elemanları:")
            for item in mod2_list:
                print(item)
            
            # İlk elemanı yazdır
            if mod2_list:
                print("mod2'nin ilk elemanı:", mod2_list[0])
        else:
            print("mod2 geçerli bir liste değil.")

# Test
no_value = "0"  # Gerçek 'no' değeri ile değiştirin 
get_robot_mod_info(no_value)
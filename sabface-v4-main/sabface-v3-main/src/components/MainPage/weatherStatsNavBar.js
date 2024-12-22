import React, { useState, useContext, useEffect } from "react"; // React bileşenlerini toplu şekilde import ediyoruz.
import { ReactComponent as Clear } from "../../img/sun.svg";
import { ReactComponent as Clouds } from "../../img/clouds.svg";
import { ReactComponent as Rain } from "../../img/rainy-2.svg";
import { BellIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import pp from "../../img/pp.jpg";
import Lottie from "lottie-react";
import Cloudy from "../../img/cloudy.json";
import sunny from "../../img/sunny.json";
import { Modal } from "antd";
import { ThemeContext } from "../../context/themeContenx";
import { useDispatch } from "react-redux";
import { setCoordinates, setCityCoordinates } from "../../redux/ugvCoordinatesSlice";


// Tema renklerini yönetmek için bir sınıf oluşturuyor.
class ThemeStyles {
  constructor(theme) { // Temayı alarak sınıfın içinde saklıyor.
    this.theme = theme;
  }

  // Tema bağlı olarak metin rengini döndürüyor.
  get textColor() {
    return this.theme === "dark" ? '#fff' : '#000';
  }

  // Tema bağlı olarak arka plan rengini döndürüyor.
  get backgroundColor() {
    return this.theme === "dark" ? '#555' : '#f0f0f0';
  }

  // Tema bağlı olarak kenarlık rengini döndürüyor.
  get borderColor() {
    return this.theme === "dark" ? '#777' : '#d3d3d3';
  }

  // Tema bağlı olarak buton arka plan rengini döndürüyor.
  get buttonBackgroundColor() {
    return this.theme === "dark" ? '#333' : '#ddd';
  }
}

// Ana bileşeni tanımlıyor.
function WeatherStatsNavbar({ value, weatherType, day }) {
  // Durum yönetimi için useState kullanıyor.
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menü açık mı kapalı mı bilgisini tutuyor.
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal açık mı kapalı mı bilgisini tutuyor.
  const [modalContentKey, setModalContentKey] = useState(""); // Modal içeriğini tanımlamak için anahtar
  const [modalTitle, setModalTitle] = useState(""); // Modal başlığını tutuyor.
  const [selectedLanguage, setSelectedLanguage] = useState("TR"); // Seçili dil bilgisini tutuyor.
  const { theme, toggleTheme } = useContext(ThemeContext); // ThemeContext'ten tema ve tema değiştirme fonksiyonunu alıyor.
  const themeStyles = new ThemeStyles(theme); // Tema renklerini almak için ThemeStyles sınıfını kullanıyor.
  const username = "ibrahimCevik018"; // Kullanıcı adını tanımlıyor.
  const [userName, setUserName] = useState("Ahmet Yılmaz"); // İsim soyisim durumu
  const [email, setEmail] = useState("ahmet.yilmaz@example.com"); // Eposta durumu
  const [phone, setPhone] = useState("+90 555 123 4567"); // Telefon durumu
  const [profilePicture, setProfilePicture] = useState(pp); // Profil fotoğrafını tutuyor
  const [cityName, setCityName] = useState(""); // Şehir ismini tutmak için
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null }); // Enlem ve boylamı tutmak için
  const dispatch = useDispatch(); // Dispatch fonksiyonunu tanımlıyoruz.
  const [error, setError] = useState(null); // Hata mesajını tutmak için state
  const [countries, setCountries] = useState([]);
const [cities, setCities] = useState([]);
const [selectedCountry, setSelectedCountry] = useState("");

useEffect(() => {
  // Ülkeleri çek
  fetch("https://countriesnow.space/api/v0.1/countries")
    .then((response) => response.json())
    .then((data) => setCountries(data.data))
    .catch((error) => console.error("Ülke verileri alınamadı:", error));
}, []);

const handleCountryChange = (country) => {
  setSelectedCountry(country);
  const countryData = countries.find((c) => c.country === country);
  setCities(countryData ? countryData.cities : []);
};

  // Hava durumu türüne göre doğru ikonu ayarlıyor.
  let WeatherIcon;
  if (weatherType === "Clear") {
    WeatherIcon = (
      <Lottie animationData={sunny} style={{ width: "5vh", height: "5vh" }} /> // Güneşli hava için animasyonu gösteriyor.
    );
  } else if (weatherType === "Clouds") {
    WeatherIcon = (
      <Lottie animationData={Cloudy} style={{ width: "5vh", height: "5vh" }} /> // Bulutlu hava için animasyonu gösteriyor.
    );
  } else if (weatherType === "Rain") {
    WeatherIcon = <Rain style={{ width: "4vh", height: "4vh" }} />; // Yağmurlu hava için SVG ikonu gösteriyor.
  } else {
    WeatherIcon = null; // Diğer durumlarda hiçbir şey göstermiyor.
  }

  // Menü açma/kapama fonksiyonu.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Menü durumunu tersine çeviriyor.
  };

  // Dil değiştirme arayüzünü tanımlıyor.
  const LanguageToggle = () => {
    const languages = [
      { code: "TR", label: "TR" },
      { code: "ENG", label: "ENG" }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        <div style={{ color: themeStyles.textColor, marginBottom: '10px', transition: 'color 0.3s ease' }}>
          <strong>Dil Seçeneği:</strong>
        </div>
        <div style={{
          display: 'flex',
          borderRadius: '20px',
          border: `1px solid ${themeStyles.borderColor}`,
          overflow: 'hidden',
          position: 'relative',
          width: '150px',
          backgroundColor: themeStyles.backgroundColor,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => {
                setSelectedLanguage(language.code); // Seçimi günceller.
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedLanguage === language.code ? 'bold' : 'normal',
                color: selectedLanguage === language.code ? themeStyles.textColor : '#666',
                backgroundColor: selectedLanguage === language.code ? themeStyles.buttonBackgroundColor : 'transparent',
                opacity: selectedLanguage === language.code ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              {language.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Yeni bir bileşen oluşturuyoruz: NotificationToggle
  const NotificationToggle = () => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const notifications = [
      { code: "MAIL", label: "Mail" },
      { code: "SMS", label: "SMS" },
      { code: "APP", label: "Uygulama" }
    ];

    const toggleNotification = (code) => {
      setSelectedNotifications((prev) => 
        prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
        <div style={{ color: themeStyles.textColor, marginBottom: '10px', transition: 'color 0.3s ease' }}>
          <strong>Bildirim Ayarları:</strong>
        </div>
        <div style={{
          display: 'flex',
          borderRadius: '20px',
          border: `1px solid ${themeStyles.borderColor}`,
          overflow: 'hidden',
          position: 'relative',
          width: '150px',
          backgroundColor: themeStyles.backgroundColor,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>
          {notifications.map((notification) => (
            <div
              key={notification.code}
              onClick={() => toggleNotification(notification.code)} // Seçimi günceller.
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedNotifications.includes(notification.code) ? 'bold' : 'normal',
                color: selectedNotifications.includes(notification.code) ? themeStyles.textColor : '#666',
                backgroundColor: selectedNotifications.includes(notification.code) ? themeStyles.buttonBackgroundColor : 'transparent',
                opacity: selectedNotifications.includes(notification.code) ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              {notification.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modal'ı gösteren fonksiyon.
  const showModal = (content) => {
    setModalTitle(content); // Modal başlığını ayarla
    setModalContentKey(content); // İçeriği tanımlamak için sadece bir anahtar sakla
    setIsModalVisible(true); // Modal'ı görünür yap
  };

  // Koordinatları almak için fonksiyon
 // Backend'den koordinatları almak için fonksiyon
 const getCoordinates = async (city) => {
  const url = `https://localhost:44315/get-coordinates?cityName=${city}`; // Şehir adını dinamik ekle

  try {
    const response = await fetch(url); // GET isteği gönder
    if (!response.ok) throw new Error("Şehir bulunamadı veya bir hata oluştu."); // Hata kontrolü

    const data = await response.json(); // JSON yanıtını al

    // Redux'a gelen koordinatları yönlendirme
    dispatch(setCityCoordinates({ latitude: data.latitude, longitude: data.longitude }));

    // Yerel state güncelleme
    setCoordinates({ latitude: data.latitude, longitude: data.longitude }); 
    setError(null); // Hata mesajını sıfırla
  } catch (err) {
    // Hata durumu
    setError(err.message); 
    setCoordinates({ latitude: null, longitude: null }); // Koordinatları sıfırla
  }
};




  // Modal içeriğini dinamik olarak render eden fonksiyon
  const renderModalContent = () => {
    if (modalContentKey === "Profil ") {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, whiteSpace: 'nowrap', color: themeStyles.textColor, transition: 'color 0.3s ease' }}>
            <p><strong>Kullanıcı Adı:</strong> {username}</p>
            <p><strong>İsim Soyisim:</strong> {userName}</p> {/* Güncellenmiş isim soyisim */}
            <p><strong>Eposta:</strong> {email}</p> {/* Güncellenmiş eposta */}
            <p><strong>Telefon:</strong> {phone}</p> {/* Güncellenmiş telefon */}
            <button onClick={() => showModal("Düzenle Profil")} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: themeStyles.buttonBackgroundColor,
              color: themeStyles.textColor
            }}>Düzenle</button> {/* Düzenle butonu */}
          </div>
          <div style={{ flex: 1, textAlign: 'center', marginLeft: '20px' }}>
            <img src={profilePicture} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />
          </div>
        </div>
      );
    } else if (modalContentKey === "Düzenle Profil") {
      return (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>İsim Soyisim:</strong></label>
            <input
              type="text"
              placeholder="İsim Soyisim"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // İsim soyisim güncelleme
              style={{ marginBottom: '10px', width: '40%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '11%', display: 'inline-block', color: themeStyles.textColor }}><strong>Eposta:</strong></label>
            <input
              type="email"
              placeholder="Eposta"
              value={email.trim()} // Boşlukları kaldırmak için trim() kullanıldı
              onChange={(e) => setEmail(e.target.value.trim())} // Boşlukları kaldırmak için trim() kullanıldı
              style={{ marginBottom: '10px', width: '50%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '12%', display: 'inline-block', color: themeStyles.textColor }}><strong>Telefon:</strong></label>
            <input
              type="tel"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} // Telefon güncelleme
              style={{ marginBottom: '10px', width: '50%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '30%', display: 'inline-block', color: themeStyles.textColor }}><strong>Profil Fotoğrafı:</strong></label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfilePicture(reader.result); // Yeni profil fotoğrafını ayarla
                  };
                  reader.readAsDataURL(file);
                }
              }} // Profil fotoğrafı güncelleme
              style={{ marginBottom: '0', width: '50%' }}
            />
          </div>
          <button onClick={handleUpdateProfile} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: themeStyles.buttonBackgroundColor,
            color: themeStyles.textColor
          }}>Güncelle</button> {/* Güncelle butonu */}
        </div>
      );
    } else if (modalContentKey === "Sistem Ayarları ") {
      return (
        <div>
      <div style={{ margin: "20px" }}>
  {/* Ülke ve Şehir Seçimi */}
  <label htmlFor="countrySelect" style={{ marginBottom: "10px" }}>
    <strong>Ülke Seç:</strong>
  </label>
  <select
    id="countrySelect"
    value={selectedCountry}
    onChange={(e) => handleCountryChange(e.target.value)}
    style={{
      width: "50%",
      marginBottom: "10px",
      padding: "5px",
      borderRadius: "5px",
    }}
  >
    <option value="">--Ülke Seç--</option>
    {countries.map((country) => (
      <option key={country.country} value={country.country}>
        {country.country}
      </option>
    ))}
  </select>

  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <label htmlFor="citySelect" style={{ marginRight: "10px" }}>
      <strong>Şehir Seç:</strong>
    </label>
    <select
      id="citySelect"
      value={cityName}
      onChange={(e) => setCityName(e.target.value)}
      style={{
        width: "50%",
        padding: "5px",
        borderRadius: "5px",
      }}
      disabled={!selectedCountry}
    >
      <option value="">--Şehir Seç--</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  {/* Butonu sağa kaydırmak için flex kullanımı */}
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <button
      onClick={() => getCoordinates(cityName)}
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        backgroundColor: themeStyles.buttonBackgroundColor,
        color: themeStyles.textColor,
      }}
    >
      Kaydet
    </button>
  </div>
</div>



          <div style={{ display: 'flex', justifyContent: 'space-between' }}> {/* Flexbox for alignment */}
            <div style={{ flex: 1 }}> {/* LanguageToggle on the left */}
              <LanguageToggle /> {/* Dinamik dil seçimi */}
            </div>
            <div style={{ flex: 1 }}> {/* NotificationToggle on the right */}
              <NotificationToggle /> {/* Yeni bildirim ayarları bileşeni */}
            </div>
          </div>
          <div style={{ marginTop: '15px' }}> {/* Theme selection on a new line */}
            <strong style={{ color: themeStyles.textColor }}>Tema Seçeneği:</strong> {/* Dinamik renk */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: themeStyles.buttonBackgroundColor,
                color: themeStyles.textColor
              }}
            >
              {theme === "dark" ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              <span style={{ marginLeft: '5px' }}>Tema Değiştir</span>
            </button>
          </div>
        </div>
      );
    } else if (modalContentKey === "Eğitim Videoları ") {
      return (
        <div style={{ color: themeStyles.textColor, transition: 'color 0.3s ease' }}>
          <p>Bu bölümde eğitim videoları yer alacak.</p>
        </div>
      );
    } else if (modalContentKey === "Çıkış") {
      return (
        <div style={{ color: themeStyles.textColor, transition: 'color 0.3s ease' }}>
          <p>Çıkmak istediğinizden emin misiniz?</p> {/* Çıkış onay mesajı */}
        </div>
      );
    } else {
      return null;
    }
  };

  const handleOk = () => {
    setIsModalVisible(false); // Modal'ı kapatıyor.
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Modal'ı kapatıyor.
    // Form verilerini sıfırlama
    setUserName("Ahmet Yılmaz"); // Varsayılan isim soyisim
    setEmail("ahmet.yilmaz@example.com"); // Varsayılan eposta
    setPhone("+90 555 123 4567"); // Varsayılan telefon
    setProfilePicture(pp); // Varsayılan profil fotoğrafı
  };

  // Profil güncelleme fonksiyonu
  const handleUpdateProfile = () => {
    // Burada güncellemeleri kaydedebilirsiniz
    setModalContentKey("Profil "); // Profil kısmına geri dön
    setModalTitle("Profil"); // Başlığı "Profil" olarak güncelle
  };

  // Bileşenin JSX çıktısı.
  return (
    <div className={`flex items-center gap-9 mr-16 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="bg-sabGreenDark dark:bg-sabDarkBlack rounded-full p-3">
        {WeatherIcon && <div>{WeatherIcon}</div>} {/* Hava durumu ikonunu gösteriyor. */}
      </div>
      <div>
        <div className="font-bold text-xl">
          {value}°C <p>{day}</p> {/* Sıcaklık ve günü gösteriyor. */}
        </div>
      </div>
      <div>
        <BellIcon className="h-8 text-sabGreenDark dark:text-white" /> {/* Bildirim ikonu. */}
      </div>
      <div>
        <img
          src={profilePicture}
          className="h-14 rounded-full cursor-pointer"
          onClick={toggleMenu} // Menü açma fonksiyonunu çağırıyor.
          alt="Profile"
          title="Hesap"
        />
        {isMenuOpen && ( // Menü açıldığında gösterilecek içerik.
          <div className="absolute right-8 bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 mt-2 border border-gray-300 dark:border-gray-600" style={{ zIndex: 10, borderRadius: '40px' }}>
            <p className="mb-2" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: '300' }}> {username}</p>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Profil ")}>Profil</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Eğitim Videoları ")}>Eğitim Videoları</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Sistem Ayarları ")}>Ayarlar</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Çıkış")}>Çıkış</button>
          </div>
       )}
      </div> 
      <Modal
        title={modalTitle} // Dinamik başlık
        visible={isModalVisible} // Modal görünürlük durumu
        onOk={handleOk} // Tamam butonu için fonksiyon
        onCancel={handleCancel} // İptal butonu için fonksiyon
        okText="Tamam"
        cancelText="İptal"
      >
        {renderModalContent()} {/* Dinamik içeriği çağır */}
      </Modal>
    </div>
  );
}

export default WeatherStatsNavbar; // Bileşeni dışa aktarıyor.

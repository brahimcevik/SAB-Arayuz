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
import axios from 'axios';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



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

  // Yeni eklenen input alanları için renkler
  get inputTextColor() {
    return this.theme === "dark" ? '#fff' : '#000'; // Input metin rengi
  }

  get inputBackgroundColor() {
    return this.theme === "dark" ? '#000' : '#fff'; // Input arka plan rengi
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

  
 
  const [cityName, setCityName] = useState(""); // Şehir ismini tutmak için
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null }); // Enlem ve boylamı tutmak için
  const dispatch = useDispatch(); // Dispatch fonksiyonunu tanımlıyoruz.
  const [error, setError] = useState(null); // Hata mesajını tutmak için state
  const [countries, setCountries] = useState([]);
const [cities, setCities] = useState([]);

const [userId, setUserId] = useState(null);
const [savedCity, setSavedCity] = useState(localStorage.getItem('city') || '');
const [ulke, setUlke] = useState(localStorage.getItem('ulke') || '');
const [userName, setUserName] = useState(localStorage.getItem('userName')|| ''); // Kullanıcı adını tanımlıyor.
const [firstName, setfirstname] = useState(localStorage.getItem('firstName') || ''); // İsim soyisim durumu
const [lastName, setlastName] = useState(localStorage.getItem('lastName') || ''); // İsim soyisim durumu
const [email, setEmail] = useState(localStorage.getItem('email') || ''); // Eposta durumu
const [phone, setPhone] = useState(localStorage.getItem('phone') || ''); // Telefon durumu
const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || ''); // Profil fotoğrafını tutuyor

const navigate = useNavigate(); // useNavigate hook'unu burada tanımlıyoruz.

const [robotName, setRobotName] = useState("");
const [robotColor, setRobotColor] = useState("");

const handleSaveCityAndCoordinates = (cityName) => {
  // cityName'i localStorage'a kaydet ve state'i güncelle
  localStorage.setItem('city', cityName);
  setSavedCity(cityName);
  
  // Koordinatları güncelle
  updateCityAndGetCoordinates(cityName);
};




useEffect(() => {
  // Ülkeleri çek
  fetch("https://countriesnow.space/api/v0.1/countries")
    .then((response) => response.json())
    .then((data) => setCountries(data.data))
    .catch((error) => console.error("Ülke verileri alınamadı:", error));
}, []);

const handleCountryChange = (country) => {
  setUlke(country);
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
              onClick={() => {
                toggleNotification(notification.code); // Bildirim seçimini günceller.
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedNotifications.includes(notification.code) ? 'bold' : 'normal',
                color: themeStyles.textColor,
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

  // Yeni bir bileşen oluşturuyoruz: ProfileSettings
  const ProfileSettings = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px'
          }}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="İsim"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px',
            marginTop: '10px'
          }}
          value={firstName}
          onChange={(e) => setfirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Soyisim"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px',
            marginTop: '10px'
          }}
          value={lastName}
          onChange={(e) => setlastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-posta"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px',
            marginTop: '10px'
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Telefon"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px',
            marginTop: '10px'
          }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Profil Fotoğrafı"
          style={{
            color: themeStyles.inputTextColor,
            backgroundColor: themeStyles.inputBackgroundColor,
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: '5px',
            padding: '5px',
            marginTop: '10px'
          }}
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
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
 const updateCityAndGetCoordinates = async (cityName) => {
  const userId = localStorage.getItem("userId"); // localStorage'dan userId al
  const url = `https://localhost:44315/api/User/update-city/${userId}`;

  try {
    const response = await axios.patch(url, `"${cityName}"`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;

      // Redux'a gelen koordinatları yönlendirme
      dispatch(setCityCoordinates({
        latitude: data.coordinates.latitude,
        longitude: data.coordinates.longitude,
      }));

      setCoordinates({
        latitude: data.coordinates.latitude,
        longitude: data.coordinates.longitude,
      });
      setError(null); // Hata mesajını sıfırla
      message.success("Şehir başarıyla güncellendi!");

      
    }
  } catch (err) {
    console.error("Şehir güncelleme hatası:", err);
    setError("Şehir güncellenemedi.");
  }
};






  // Modal içeriğini dinamik olarak render eden fonksiyon
  const renderModalContent = () => {
    if (modalContentKey === "Profil ") {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, whiteSpace: 'nowrap', color: themeStyles.textColor, transition: 'color 0.3s ease' }}>
            <p><strong>Kullanıcı Adı:</strong> {userName}</p>
            <p><strong>İsim :</strong> {firstName}</p> {/* Güncellenmiş isim soyisim */}
            <p><strong> Soyisim :</strong> {lastName}</p> {/* Güncellenmiş isim soyisim */}
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
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Kullanıcı Adı:</strong></label>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // İsim soyisim güncelleme
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>İsim :</strong></label>
            <input
              type="text"
              placeholder="İsim "
              value={firstName}
              onChange={(e) => setfirstname(e.target.value)} // İsim soyisim güncelleme
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Soyisim:</strong></label>
            <input
              type="text"
              placeholder=" Soyisim"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)} // İsim soyisim güncelleme
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Eposta:</strong></label>
            <input
              type="email"
              placeholder="Eposta"
              value={email.trim()} // Boşlukları kaldırmak için trim() kullanıldı
              onChange={(e) => setEmail(e.target.value.trim())} // Boşlukları kaldırmak için trim() kullanıldı
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Telefon:</strong></label>
            <input
              type="tel"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} // Telefon güncelleme
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
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
              style={{ marginBottom: '10px', width: '40%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff',  borderRadius: '5px'  }}
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
   <div style={{ margin: "10px", display: 'flex', flexDirection: 'column', gap: '5px' ,}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label htmlFor="countrySelect" style={{ marginBottom: "0",color: themeStyles.textColor, }}>
        <strong>Ülke Seç:</strong>
      </label>
      <select
        id="countrySelect"
        value={ulke}
        onChange={(e) => handleCountryChange(e.target.value)}
        style={{
          width: "100px",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.textColor,
          border: `1px solid ${themeStyles.borderColor}`,
        }}
      >
        <option value="">--Ülke Seç--</option>
        {countries.map((country) => (
          <option key={country.country} value={country.country}>
            {country.country}
          </option>
        ))}
      </select>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label htmlFor="citySelect" style={{ marginBottom: "0",color: themeStyles.textColor, }}><strong>Şehir Seç:</strong></label>
      <select
        id="citySelect"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        style={{
          width: "100px",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.textColor,
          border: `1px solid ${themeStyles.borderColor}`,
        }}
      >
        <option value="">--Şehir Seç--</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  </div>
  <button
    onClick={() => {
      handleSaveCityAndCoordinates(cityName);
      handleUpdateProfile();
    }}
    style={{
      padding: "5px 15px",
      borderRadius: "5px",
      backgroundColor: themeStyles.buttonBackgroundColor,
      color: themeStyles.textColor,
      fontSize: "14px",
      alignSelf: "flex-start",
      marginLeft: "380px",
    }}
  >
    Kaydet
  </button>

  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <button
      style={{
        padding: "5px 15px",
        borderRadius: "5px",
        backgroundColor: themeStyles.buttonBackgroundColor,
        color: themeStyles.textColor,
        fontSize: "14px",
        alignSelf: "flex-start",
        marginLeft: "0px",
      }}
    >
      <strong>Seçilen Ülke:</strong> {ulke}
    </button>

    <button
      style={{
        padding: "5px 15px",
        borderRadius: "5px",
        backgroundColor: themeStyles.buttonBackgroundColor,
        color: themeStyles.textColor,
        fontSize: "14px",
        alignSelf: "flex-start",
        marginLeft: "0px",
      }}
    >
      <strong>Seçilen Şehir:</strong> {savedCity}
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
      const handleLogoutConfirmation = () => {
        // Kullanıcı bilgilerini temizle
        window.location.href = '/signin';
        // localStorage.clear();
        sessionStorage.removeItem("isAuthenticated");

        
      };
       
      

      return (
        <div style={{ color: themeStyles.textColor, transition: 'color 0.3s ease' }}>
          <p>Çıkmak istediğinizden emin misiniz?</p>
          <button onClick={handleLogoutConfirmation} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: themeStyles.buttonBackgroundColor,
            color: themeStyles.textColor
          }}>Çıkış Yap</button>
        </div>
      );
    } else if (modalContentKey === "Robot Ekle") {
      
      return (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Robot İsmi:</strong></label>
            <input
              type="text"
              placeholder="Robot İsmi"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff', borderRadius: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ width: '20%', display: 'inline-block', color: themeStyles.textColor }}><strong>Robot Rengi:</strong></label>
            <input
              type="text"
              placeholder="Robot Rengi"
              value={robotColor}
              onChange={(e) => setRobotColor(e.target.value)}
              style={{ marginBottom: '10px', width: '30%', backgroundColor: themeStyles.backgroundColor, color: themeStyles.inputTextColor || '#ffffff', borderRadius: '5px' }}
            />
          </div>
          <button onClick={handleAddRobot} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: themeStyles.buttonBackgroundColor,
            color: themeStyles.textColor
          }}>Ekle</button> {/* Ekle butonu */}
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

   
  };

  // Profil güncelleme fonksiyonu
  const handleAddRobot = () => {
    const userId = localStorage.getItem("userId"); // localStorage'dan userId al
    const url = `https://localhost:44315/api/UgvRobot?userId=${userId}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: "",
        ugvName: robotName,
        ugvColor: robotColor,
        ugvDistance: 0,
        ugvHerbicide: 0,
        carLat: 0,
        carLong: 0,
        carLoc: "string",
        ugvMission: "string",
        ugvSpeed: 0,
        infoDate: new Date().toISOString(),
        no: 0,
        siraUzunlugu: 0,
        ikiSiraArasiMesafe: 0,
        toplamSiraSayisi: 0,
        donusDerecesi: 0,
        ilkDonusAcisi: "string",
        mod2: "string",
        lastActiveMod: "string",
        status: true,
        onlineStatus: "string",
        lastRunTime: new Date().toISOString(),
        direction: "string",
        manuelStatus: true,
        heading: 0,
        userId: userId
      })
    })
    .then(response => {
      if (response.ok) {
        message.success("Robıt başarıyla eklendi!");// Log success message if operation is successful
      }
    })
    .catch(error => console.error('Error:', error));
  };
  
    const handleUpdateProfile = async () => {
     
      const userId = localStorage.getItem("userId"); // localStorage'dan userId al
    
      const apiUrl = `https://localhost:44315/api/User/${userId}`;
    
      const requestBody = {
        id: userId,
        username:userName ,
        password: "", // Varsayılan veya boş bırakılan bir değer.
        createdAt: new Date().toISOString(), // Oluşturma zamanı (isteğe bağlı, sunucu kontrolü varsa gerekmez).
        roles: ["user"], // Roller (doldurmanız gerekirse değiştirin).
        city: cityName, // Şehir bilgisi (gerekliyse doldurun).
        profile: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          profilePicture: profilePicture, // Base64 formatında profil fotoğrafı.
          ulke:ulke,
          
        },
      };
    
      try {
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(requestBody),
        });
    
        if (response.ok) {
          const result = await response.json();
          message.success("profil başarıyla güncellendi!");
          // alert("Profil başarıyla güncellendi.");
         
        } else {
          console.error("Profil güncellenirken hata oluştu:", response.status);
          // alert("Profil güncellenirken bir hata oluştu.");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
        // alert("Profil güncellenirken bir hata oluştu.");
      }
   // Burada güncellemeleri kaydedebilirsiniz
   
   
 };

    

    
  // Bileşenin JSX çıktısı.
  return (
    <div className={`flex items-center gap-9 mr-16 ${"bg-white dark:bg-sabDarkBG p-0"}`}>
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
          <div className="absolute right-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-2 border border-gray-300 dark:border-gray-600" style={{ zIndex: 10, borderRadius: '40px' }}>
            <p className="mb-2" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: '300' }}> {userName}</p>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Profil ")}>Profil</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Eğitim Videoları ")}>Eğitim Videoları</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Sistem Ayarları ")}>Ayarlar</button>
            <button className="block w-full text-left mb-1" style={{ color: themeStyles.textColor, transition: 'color 0.3s ease', fontWeight: 'bold' }} onClick={() => showModal("Robot Ekle")}>Robot Ekle</button>
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

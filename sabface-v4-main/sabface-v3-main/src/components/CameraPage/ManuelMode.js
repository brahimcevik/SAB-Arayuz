import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedId } from "../../redux/ugvSlice"; // Redux seçici

const ManuelMode = () => {
  const [speed, setSpeed] = useState(0); // Hız değeri state
  const [movement, setMovement] = useState(""); // Hareket bilgisi

  // Seçili ID'yi alın
  const selectedId = useSelector(selectSelectedId);

  const handleDirection = (direction) => {
    // Hareket verisini belirli formatta string olarak hazırlıyoruz
    const movementData = `[${speed.toFixed(2)},"${direction}"]`;
    setMovement(movementData); // Ekranda gösterilecek hareketi güncelle

    // Hareket verisini API'ye string olarak gönder
    sendMovementData(selectedId, movementData); // Seçili ID ve hareket verisini gönder
  };

  const handleSpeedChange = (event) => {
    setSpeed(parseFloat(event.target.value)); // Slider ile hız değeri güncelleniyor ve sayıya dönüştürülüyor
  };

  // Hareket verisini bir API'ye göndermek için PATCH isteği
  const sendMovementData = (robotId, movementData) => {
    const apiUrl = `https://localhost:44315/api/UgvRobot/update-direction/${robotId}`; // Dinamik API URL'si

    fetch(apiUrl, {
      method: 'PATCH', // PATCH isteği yapılıyor
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction: movementData }), // Beklenen "direction" verisi
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Sunucudan başarısız cevap alındı');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Başarılı:', data); // Başarılı işlem mesajı
      })
      .catch((error) => {
        console.error('Hata:', error); // Hata mesajı
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manuel Mod</h1>
      </div>
      <div style={styles.controller}>
        <div style={styles.circleContainer}>
          <button onClick={() => handleDirection('İleri')} style={styles.upButton}>↑</button>
          <button onClick={() => handleDirection('Sol')} style={styles.leftButton}>←</button>
          <button onClick={() => handleDirection('Sağ')} style={styles.rightButton}>→</button>
          <button onClick={() => handleDirection('Geri')} style={styles.downButton}>↓</button>
        </div>

        <div style={styles.speedControl}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={speed}
            onChange={handleSpeedChange}
            style={styles.slider}
          />
          <div style={styles.speedDisplay}>
            <span>Hız: {speed.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Hareket bilgisi dizi formatında gösterilecek */}
      <div style={styles.movementContainer}>
        {movement && <p style={styles.movementText}>Gönderilen Hareket: {movement}</p>}
      </div>
    </div>
  );
};

// Stilleri doğrudan JS içinde yazıyoruz
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Daha açık bir arka plan rengi
    width: "80vh",
    height: "70vh",
    marginTop: "40px",
    borderRadius: "16px", // Daha yuvarlak köşeler
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)", // Daha hafif gölge efekti
    flexDirection: "column",
    padding: "20px", // İçerik için biraz boşluk
  },
  header: {
    width: "100%",
    textAlign: "center",
    marginBottom: "20px", // Başlık ile içerik arasında boşluk
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "rgb(99, 185, 149)", // Renk güncellemesi
    margin: "0", // Başlık etrafında boşluk yok
  },
  controller: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px", // Butonlar ile hız kontrolü arasında boşluk
  },
  circleContainer: {
    position: "relative",
    width: "200px",
    height: "200px",
    borderRadius: "50%", // Tam bir daire yapmak için
    backgroundColor: "rgb(99, 185, 149)", // Çember arka plan rengi
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  upButton: {
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    cursor: "pointer",
    backgroundColor: "rgb(99, 185, 149)", // Buton arka plan rengi
    color: "white", // Buton metin rengi
    border: "none", // Kenar çizgisi yok
    borderRadius: "50%", // Yuvarlak buton
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Hafif gölge
  },
  downButton: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    cursor: "pointer",
    backgroundColor: "rgb(99, 185, 149)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  leftButton: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    cursor: "pointer",
    backgroundColor: "rgb(99, 185, 149)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  rightButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    cursor: "pointer",
    backgroundColor: "rgb(99, 185, 149)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  speedControl: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "30px", // Daire ile hız kontrolü arasında boşluk
  },
  slider: {
    writingMode: "bt-lr", // Dikey slider
    WebkitAppearance: "slider-vertical",
    height: "200px",
    margin: "10px 0", // Slider üst ve altında boşluk
  },
  speedDisplay: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  movementContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 15px", // İçerik için biraz boşluk
    borderRadius: "8px",
    backgroundColor: "rgb(99, 185, 149)", // Gönderilen hareket için arka plan rengi
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hafif gölge efekti
    maxWidth: "200px", // Maksimum genişlik
    textAlign: "center", // Metni ortala
  },
  movementText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333", // Koyu gri rengi
    margin: "0", // Metin etrafında boşluk yok
  },
};

export default ManuelMode;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedId } from "../../redux/ugvSlice"; // Redux selector

const ManuelMode = () => {
  const [movements, setMovements] = useState([
    { speed: 0, direction: "İleri" },  // Ana hareket
    { degree: 0, active: false },  // Sağ kamera
    { degree: 0, active: false },  // Sol kamera
    { degree: 0, active: false },  // Çapa mekanizması
  ]); // Hareket ve yön bilgisi

  const [lastAction, setLastAction] = useState(""); // Son hareket durumu

  // Seçili ID'yi al
  const selectedId = useSelector(selectSelectedId);

  const handleDegreeChange = (index, event) => {
    const updatedMovements = [...movements];
    updatedMovements[index].degree = parseInt(event.target.value);
    setMovements(updatedMovements);

    if (updatedMovements[index].active) {
      const component = index === 1 ? "rightCamera" : index === 2 ? "leftCamera" : "capaMek";
      setLastAction(`${component}, ${updatedMovements[index].degree}, 1`);
      sendMovementData(selectedId, updatedMovements);
    }
  };

  const toggleActive = (index) => {
    const updatedMovements = [...movements];
    updatedMovements[index].active = !updatedMovements[index].active;
    setMovements(updatedMovements);

    const component = index === 1 ? "rightCamera" : index === 2 ? "leftCamera" : "capaMek";
    setLastAction(`${component}, ${updatedMovements[index].degree}, ${updatedMovements[index].active ? 1 : 0}`);
    sendMovementData(selectedId, updatedMovements);
  };

  const handleSpeedChange = (event) => {
    const updatedMovements = [...movements];
    updatedMovements[0] = { ...updatedMovements[0], speed: parseFloat(event.target.value) };

    setMovements(updatedMovements);
    sendMovementData(selectedId, updatedMovements);
  };

  const handleDirection = (direction) => {
    const updatedMovements = [...movements];
    updatedMovements[0].direction = direction;
    setMovements(updatedMovements);
    setLastAction(`${direction}, ${updatedMovements[0].speed.toFixed(2)}`);
    sendMovementData(selectedId, updatedMovements);
  };

  const sendMovementData = (robotId, movementData) => {
    const apiUrl = `https://localhost:44315/api/UgvRobot/update-direction/${robotId}`;
  
    const requestBody = {
      direction: JSON.stringify([
        [Number(movementData[0].speed.toFixed(2)), movementData[0].direction],
        ["leftCamera", movementData[1].degree, movementData[1].active ? 1 : 0],
        ["capaMek", movementData[2].degree, movementData[2].active ? 1 : 0],
        ["rightCamera", movementData[3].degree, movementData[3].active ? 1 : 0],
      ]),
    };
  
    fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Sunucudan olumsuz bir yanıt alındı');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Başarılı:', data);
      })
      .catch((error) => {
        console.error('Hata:', error);
      });
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.cameraContainer}>
        {['Sol Kamera', 'Çapa Mekaniz.', 'Sağ Kamera'].map((label, index) => (
          <div key={index} style={styles.camera}>
            <h2 style={styles.cameraTitle}>{label}</h2>
            <input
              type="range"
              min="0"
              max="180"
              step="1"
              value={movements[index + 1].degree}
              onChange={(e) => handleDegreeChange(index + 1, e)}
              style={styles.verticalSlider}
              disabled={!movements[index + 1].active}
            />
            <span>{movements[index + 1].degree}°</span>
            <button
              onClick={() => toggleActive(index + 1)}
              style={{
                ...styles.toggleButton,
                backgroundColor: movements[index + 1].active ? 'green' : 'red',
              }}
            >
              {movements[index + 1].active ? 'Aktif' : 'Pasif'}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.controller}>
        <div style={styles.circleContainer}>
          <button onClick={() => handleDirection('Geri')} style={styles.downButton}>↓</button>
          <button onClick={() => handleDirection('İleri')} style={styles.upButton}>↑</button>
          <button onClick={() => handleDirection('Sol')} style={styles.leftButton}>←</button>
          <button onClick={() => handleDirection('Sağ')} style={styles.rightButton}>→</button>
        </div>

        <div style={styles.speedControlContainer}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={movements[0].speed}
            onChange={handleSpeedChange}
            style={styles.verticalSlider}
          />
          <div style={styles.speedDisplay}>
            <span>Hız: {movements[0].speed.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={styles.movementContainer}>
        <div style={styles.movementBox}>
          <p style={styles.movementText}>
            Gönderilen Hareketler:<br></br> [[{movements[0].speed.toFixed(2)}, "{movements[0].direction}"];
            ["leftCamera", {movements[1].degree}, {movements[1].active ? 1 : 0}];
            ["capaMek", {movements[2].degree}, {movements[2].active ? 1 : 0}];
            ["rightCamera", {movements[3].degree}, {movements[3].active ? 1 : 0}]]
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  /* container - ManuelMode bileşeninin ana kapsayıcısı */
  container: {
    display: "flex", // Esnek kutu düzeniyle elemanları hizalar
    justifyContent: "center", // Yatayda ortalar
    alignItems: "center", // Dikeyde ortalar
    backgroundColor: "#f5f5f5", // Arka plan rengi
    width: "80vh", // Genişlik
    height: "70vh", // Yükseklik
    marginTop: "40px", // Üstten boşluk
    borderRadius: "16px", // Köşeleri yuvarlar
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)", // Gölgelendirme efekti
    flexDirection: "column", // Dikey hizalama
    padding: "20px", // İçerik ile kenarlar arası boşluk
  },
  
  /* controller - ManuelMode bileşeni içindeki yön kontrol düğmeleri ve hız slider'ı kapsayıcısı */
  controller: {
    display: "flex", // Elemanları esnek kutu düzeniyle hizalar
    alignItems: "center", // Dikeyde ortalar
    marginTop: "20px", // Üstten boşluk
    justifyContent: "center", // Yatayda ortalar
  },
  
  /* circleContainer - Yön düğmeleri için dairesel bir kapsayıcı */
  circleContainer: {
    position: "relative", // Konumlandırma için
    width: "180px", // Genişlik
    height: "180px", // Yükseklik
    borderRadius: "50%", // Tam daire oluşturur
    backgroundColor: "rgb(99, 185, 149)", // Arka plan rengi (yeşil)
    display: "flex", // Elemanları esnek kutu düzeniyle hizalar
    justifyContent: "center", // Yatayda ortalar
    alignItems: "center", // Dikeyde ortalar
    marginLeft: "-10px", // Soldan boşluk
    marginBottom:"35px",
  },
  
  /* upButton - Yukarı yön düğmesi */
  upButton: {
    position: "absolute",
    top: "5px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px", // Boyutları arttır
    height: "60px", // Boyutları arttır
    fontSize: "30px", // Yazı boyutunu arttır
    cursor: "pointer",
    backgroundColor: "#58A686",
    color: "#fff",
    borderRadius: "50%", // Butonu yuvarlak yap
    border: "none",
  
  },
  
  /* downButton - Aşağı yön düğmesi */
  downButton: {
    position: "absolute",
    bottom: "5px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px", // Boyutları arttır
    height: "60px", // Boyutları arttır
    fontSize: "30px", // Yazı boyutunu arttır
    cursor: "pointer",
    backgroundColor: "#58A686",
    color: "#fff",
    borderRadius: "50%", // Butonu yuvarlak yap
    border: "none",
  
  },
  
  /* leftButton - Sol yön düğmesi */
  leftButton: {
    position: "absolute",
      left: "5px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "60px", // Boyutları arttır
      height: "60px", // Boyutları arttır
      fontSize: "30px", // Yazı boyutunu arttır
      cursor: "pointer",
      backgroundColor: "#58A686",
      color: "#fff",
      borderRadius: "50%", // Butonu yuvarlak yap
      border: "none",
  
  },
  
  /* rightButton - Sağ yön düğmesi */
  rightButton: {
    position: "absolute",
    right: "5px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "60px", // Boyutları arttır
    height: "60px", // Boyutları arttır
    fontSize: "30px", // Yazı boyutunu arttır
    cursor: "pointer",
    backgroundColor: "#58A686",
    color: "#fff",
    borderRadius: "50%", // Butonu yuvarlak yap
    border: "none",
  
  },
  
  /* speedControlContainer - Hız slider'ı ve hız göstergesi kapsayıcısı */
  speedControlContainer: {
    display: "flex", // Esnek kutu düzeni
    flexDirection: "column", // Dikey hizalama
    alignItems: "center", // Ortalama
    marginLeft: "5px", // Soldan boşluk
  },
  
  /* speedDisplay - Hız göstergesi */
  speedDisplay: {
    fontSize: "18px", // Yazı boyutu
    marginTop: "10px", // Üstten boşluk
    fontWeight: "bold", // Kalın yazı stili
    color: "rgb(99, 185, 149)", // Yazı rengi
  },
  
  /* movementContainer - Hareket bilgileri kutusu kapsayıcısı */
  movementContainer: {
    backgroundColor: "rgb(99, 185, 149)", // Yeşilimsi arka plan
    border: "2px solid #ccc", // Gri kenarlık
    borderRadius: "8px", // Köşeleri yuvarlar
    padding: "10px", // İçerik ile kenarlar arası boşluk
    marginRight: "20px", // Sağdan boşluk
    marginBottom: "18px", // Alttan boşluk
  },
  
  
  
  /* movementText - Hareket bilgileri yazısı */
  movementText: {
    fontSize: "13px", // Yazı boyutu
    color: "#333", // Yazı rengi (koyu gri)
  },
  
  /* cameraContainer - Sağ kamera, sol kamera ve çapa mekanizması slider'ları kapsayıcı */
  cameraContainer: {
    display: 'flex', // Esnek kutu düzeni
    justifyContent: 'space-between', // Elemanlar arasında boşluk bırakır
    marginBottom: '20px', // Alttan boşluk
    width: '100%', // Tam genişlik
    
  },
  
  /* camera - Kamera ve çapa slider'larının her biri için stil */
  camera: {
    textAlign: 'center', // Yazıyı ortalar
    marginRight: '20px', // Sağdan boşluk
    flex: 1, // Esnek yerleşim için alan alır
  },
  
  /* cameraTitle - Kamera başlıkları */
  cameraTitle: {
    marginBottom: '10px', // Alttan boşluk
    fontWeight: 'bold', // Kalın yazı stili
    marginTop: '20px', // Başlığı yukarıdan biraz aşağı kaydırır
  },
  
  /* verticalSlider - Kamera ve çapa slider'ları */
  verticalSlider: {
    writingMode: 'bt-lr', // Slider'ın dikey modda çalışmasını sağlar
    WebkitAppearance: 'slider-vertical', // Webkit tarayıcılar için dikey kaydırma
    height: '110px', // Yükseklik
    width: '8px', // Genişlik
    margin: '10px 0', // Üstten ve alttan boşluk
  },
  
  /* toggleButton - Kamera ve çapa mekanizması için aktif/pasif düğmeleri */
  toggleButton: {
    padding: '5px', // İçerik ile kenarlar arası boşluk
    borderRadius: '7px', // Köşeleri yuvarlar
    border: 'none', // Kenarlık yok
    color: '#fff', // Yazı rengi
    cursor: 'pointer', // İmleç
    backgroundColor: 'red', // Pasif durumda kırmızı
  },
  };

export default ManuelMode;

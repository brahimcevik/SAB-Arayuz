import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedId } from "../../redux/ugvSlice"; // Redux selector

const ManuelMode = () => {
  const [movements, setMovements] = useState([
    { speed: 0, direction: "İleri" },  // Main movement
    { degree: 0, active: false },      // Left camera
    { degree: 0, active: false },      // CapaMek mechanism
    { degree: 0, active: false },      // Right camera
  ]);

  const [sprays, setSprays] = useState({ leftSpray: 0, rightSpray: 0 }); // Initial spray states
  const [lastAction, setLastAction] = useState("");
  const [displayedMovements, setDisplayedMovements] = useState([]);

  const selectedId = useSelector(selectSelectedId);

  const handleDegreeChange = (index, event) => {
    const updatedMovements = [...movements];
    updatedMovements[index].degree = parseInt(event.target.value);
    setMovements(updatedMovements);

    if (updatedMovements[index].active) {
      sendMovementData(selectedId, updatedMovements, sprays);
    }
  };

  useEffect(() => {
    sendMovementData(selectedId, movements, sprays);
  }, [selectedId]);

  const toggleActive = (index) => {
    const updatedMovements = [...movements];
    updatedMovements[index].active = !updatedMovements[index].active;
    setMovements(updatedMovements);

    sendMovementData(selectedId, updatedMovements, sprays);
  };

  const handleSpeedChange = (event) => {
    const updatedMovements = [...movements];
    updatedMovements[0].speed = parseFloat(event.target.value);
    setMovements(updatedMovements);
    sendMovementData(selectedId, updatedMovements, sprays);
  };

  const handleDirection = (direction) => {
    const updatedMovements = [...movements];
    updatedMovements[0].direction = direction;
    setMovements(updatedMovements);
    sendMovementData(selectedId, updatedMovements, sprays);
  };

  const toggleSpray = (sprayType) => {
    setSprays(prev => {
      const newSprayState = {
        ...prev,
        [sprayType]: prev[sprayType] === 1 ? 0 : 1, // Toggle between 1 and 0
      };

      sendMovementData(selectedId, movements, newSprayState); 
      return newSprayState;
    });
  };

  const sendMovementData = (robotId, movementData, sprayState) => {
    const filteredMovements = movementData.map((movement, index) => {
      const isActive = movement.active ? 1 : 0;

      // Return movements with active states
      return index === 0
        ? [Number(movement.speed.toFixed(2)), movement.direction]
        : [
            `${index === 1 ? "leftCamera" : index === 2 ? "capaMek" : "rightCamera"}`,
            movement.degree,
            isActive,
          ];
    });

    const leftSprayStatus = sprayState.leftSpray ? 1 : 0; // Left spray state
    const rightSprayStatus = sprayState.rightSpray ? 1 : 0; // Right spray state

    // Final movements array
    const finalMovements = [
      ...filteredMovements,
      [leftSprayStatus, rightSprayStatus], // Add spray states at the end
    ];

    setDisplayedMovements(finalMovements);

    const apiUrl = `https://localhost:44315/api/UgvRobot/update-direction/${robotId}`;
    const requestBody = {
      direction: JSON.stringify(finalMovements),
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
          throw new Error('Received a negative response from the server');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
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

          <div style={styles.sprayButtonContainer}>
            <button
              onClick={() => toggleSpray("leftSpray")}
              style={{
                ...styles.toggleButton,
                backgroundColor: sprays.leftSpray ? 'green' : 'red',
                width: '80px',
                marginRight: '5px',
              }}
            >
              Sol Püskürtme
            </button>

            <button
              onClick={() => toggleSpray("rightSpray")}
              style={{
                ...styles.toggleButton,
                backgroundColor: sprays.rightSpray ? 'green' : 'red',
                width: '80px',
              }}
            >
              Sağ Püskürtme
            </button>
          </div>
        </div>
      </div>

      <div style={styles.movementContainer}>
        <div style={styles.movementBox}>
          <p style={styles.movementText}>
            Gönderilen Hareketler:<br />
            {displayedMovements.length > 0 && (
              `[[${displayedMovements[0][0]}, "${displayedMovements[0][1]}"], ` +
              `["${displayedMovements[1][0]}", ${displayedMovements[1][1]}, ${displayedMovements[1][2]}], ` +
              `["${displayedMovements[2][0]}", ${displayedMovements[2][1]}, ${displayedMovements[2][2]}], ` +
              `["${displayedMovements[3][0]}", ${displayedMovements[3][1]}, ${displayedMovements[3][2]}], ` +
              `[${displayedMovements[4][0]}, ${displayedMovements[4][1]}]]`
            )}
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
  
  /* speedDisplay - Hz göstergesi */
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
    margin: '10px 0', // stten ve alttan boşluk
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

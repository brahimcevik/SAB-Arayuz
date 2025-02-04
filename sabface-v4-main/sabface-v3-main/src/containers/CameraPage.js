import React, { useState, useEffect } from "react";
import { Input, Button, Col, Row, Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedId, setSelectedId } from "../redux/ugvSlice";
import './style.css';
import { RobotOutlined } from '@ant-design/icons';
import logo from '../img/technical-support.png';
import user from '../img/user.png';
// ... mevcut importlar ...

// Google AI için yapılandırma
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function CameraPage() {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const [message, setMessage] = useState('');
  
  const [robotInfo, setRobotInfo] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [robots, setRobots] = useState([]);
  const [showRobots, setShowRobots] = useState(false);
  const [selectedCarNo, setSelectedCarNo] = useState('');
  const [currentContext, setCurrentContext] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Robotları Fetch Etme
  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/get_robots');
        const data = await res.json();
        console.log('Robot verileri:', data);
        setRobots(data);
      } catch (error) {
        console.error('Araçlar getirilirken hata oluştu:', error);
      }
    };

    fetchRobots();
  }, []);

  // Robot Seçimi ve Bilgilerini Getirme
  // Mod 1 Güncelleme İşlemi
const updateMod1Parameters = async (mod1Data) => {
  if (!selectedCarNo || !mod1Data) {
    console.error("Araç numarası ve mod1 parametreleri gereklidir.");
    return;
  }

  const requestData = {
    siraUzunlugu: parseFloat(mod1Data.siraUzunlugu),
    ikiSiraArasiMesafe: parseFloat(mod1Data.ikiSiraArasiMesafe),
    toplamSiraSayisi: parseFloat(mod1Data.toplamSiraSayisi),
    donusDerecesi: parseFloat(mod1Data.donusDerecesi),
    ilkDonusAcisi: mod1Data.ilkDonusAcisi,
    mod2: "", // Boş string olarak gönderiyoruz
  };

  try {
    const response = await fetch(`https://localhost:44315/api/UgvRobot/update-mod/${selectedCarNo}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mod1 parametreleri güncellenirken hata oluştu:', errorText);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Mod1 parametreleri güncellenirken hata oluştu.', sender: 'bot', icon: logo },
      ]);
    } else {
      const result = await response.json();
      console.log('Mod1 parametreleri başarıyla güncellendi:', result);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Mod1 parametreleri başarıyla güncellendi.', sender: 'bot', icon: logo },
      ]);
    }
  } catch (error) {
    console.error('Bağlantı hatası:', error.message);
    setMessages(prevMessages => [
      ...prevMessages,
      { text: 'Bağlantı hatası: ' + error.message, sender: 'bot', icon: logo },
    ]);
  }
};

// Robot Seçimi ve Bilgilerini Getirme
const handleRobotSelection = async (robotId) => {
    try {
        console.log('Seçilen robot ID:', robotId);
        dispatch(setSelectedId(robotId));

        // Robot bilgilerini getir
        const res = await fetch(`http://127.0.0.1:5000/get_robot_info/${robotId}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Robot bilgisi:', data);
            setRobotInfo(`Robot ${data.ugvName} bilgileri:\nRenk: ${data.ugvColor}\nHız: ${data.ugvSpeed} km/h\nKonum: ${data.carLat}, ${data.carLong}\nSon Çalıştırılma: ${data.lastRunTime}\nDurum: ${data.status}`);
            setSelectedCarNo(data.no);

            setMessages(prevMessages => [
                ...prevMessages,
                { text: `Robot ${data.ugvName} seçildi.`, sender: 'bot', icon: logo }
            ]);

            // Context'e göre farklı işlem yap
            const chatbotResponse = await fetch('http://127.0.0.1:5000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    currentContext === "mod1_update" 
                        ? {
                            msg: "mod1 güncelle",
                            selectedId: robotId,
                            isRobotSelected: true,
                            startMod1Update: true
                          }
                        : {
                            msg: "koordinat güncelle",
                            selectedId: robotId,
                            isRobotSelected: true,
                            startCoordinateUpdate: true
                          }
                ),
            });

            const chatbotData = await chatbotResponse.json();
            if (chatbotData.response) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: chatbotData.response, sender: 'bot', icon: logo }
                ]);
            }

            if (chatbotData.currentContext) {
                setCurrentContext(chatbotData.currentContext);
            }

            // Mod1 parametreleri varsa güncelleme yap
            if (chatbotData.mod1Parameters) {
                await updateMod1Parameters(chatbotData.mod1Parameters);
            }

        } else {
            const errorData = await res.json();
            setRobotInfo(errorData.error || 'Bir hata oluştu');
        }
    } catch (error) {
        setRobotInfo('Bağlantı hatası: ' + error.message);
    }
};



  // Koordinatları Güncelleme İşlemi
  const updateCoordinates = async (coordinatesData) => {
    if (!selectedCarNo || !coordinatesData || coordinatesData.length === 0) {
      console.error("Araç numarası ve koordinat bilgileri gereklidir.");
      return;
    }

    const mod2Data = coordinatesData.map(coord => [
      parseFloat(coord.latitude),
      parseFloat(coord.longitude)
    ]);

    const requestData = {
      siraUzunlugu: 0,
      ikiSiraArasiMesafe: 0,
      toplamSiraSayisi: 0,
      donusDerecesi: 0,
      ilkDonusAcisi: "Sol",
      mod2: JSON.stringify(mod2Data),
    };

    try {
      const response = await fetch(`https://localhost:44315/api/UgvRobot/update-mod2/${selectedCarNo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Koordinatlar güncellenirken hata oluştu:', errorText);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Koordinatlar güncellenirken hata oluştu.', sender: 'bot', icon: logo },
        ]);
      } else {
        const result = await response.json();
        console.log('Koordinatlar başarıyla güncellendi:', result);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Koordinatlar başarıyla güncellendi.', sender: 'bot', icon: logo },
        ]);
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error.message);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Bağlantı hatası: ' + error.message, sender: 'bot', icon: logo },
      ]);
    }
  };

  // Mesaj Gönderme İşlemi
  const sendMessageToBot = async (message, selectedId) => {
    if (!message) return;

    console.log('Gönderilen mesaj:', message);
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user', icon: user }]);
    setIsTyping(true);

    try {
        const res = await fetch('http://127.0.0.1:5000/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: message, selectedId: selectedId }),
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Bot yanıtı:', data);

            // Robotları gösterme kontrolü
            if (data.showRobotList || data.currentContext === "mod1_update") {
                setShowRobots(true);
                // Robot listesini yenile
                const robotsRes = await fetch('http://127.0.0.1:5000/get_robots');
                const robotsData = await robotsRes.json();
                setRobots(robotsData);
            }

            // Koordinat güncelleme işlemi için kontrol
            if (data.coordinates) {
                await updateCoordinates(data.coordinates);
            }

            // Mod1 parametreleri için kontrol
            if (data.mod1Parameters) {
                await updateMod1Parameters(data.mod1Parameters);
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { text: data.response, sender: 'bot', icon: logo },
            ]);

            // Context kontrolü ve robot listesi gösterimi
            if (data.currentContext === "robot_sorgulama" || 
                data.currentContext === "update_coordinates" || 
                data.currentContext === "mod1_update") {
                setShowRobots(true);
            } else {
                setShowRobots(false);
            }

            // Context'i güncelle
            if (data.currentContext) {
                setCurrentContext(data.currentContext);
            }

        } else {
            const errorData = await res.json();
            setMessages(prevMessages => [
                ...prevMessages,
                { text: errorData.error || 'Bir hata oluştu', sender: 'bot', icon: logo },
            ]);
        }
    } catch (error) {
        setMessages(prevMessages => [
            ...prevMessages,
            { text: 'Bağlantı hatası: ' + error.message, sender: 'bot', icon: logo },
        ]);
    } finally {
        setIsTyping(false);
        setMessage('');
    }
};

  // Enter Tuşu ile Gönderme
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessageToBot(message, selectedId);
    }
  };
  const messageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '10px'
  };
  
  const cancelButtonStyle = {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  return (
    <Row gutter={20}>
      <Col span={12}>
        <div className="chatbotContainer">
          <div className="messageContainer">
            {messages.map((msg, index) => (
              <div key={index} style={messageStyle} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={msg.icon} alt="" className="messageIcon" />
                  <span>{msg.text}</span>
                </div>
                {/* İptal butonu için kontrol */}
                {msg.sender === 'bot' && 
                 currentContext && 
                 (currentContext === "mod1_update" || 
                  currentContext === "update_coordinates") && (
                  <Button
                    style={cancelButtonStyle}
                    onClick={() => {
                      sendMessageToBot("iptal", selectedId);
                    }}
                  >
                    İptal Et
                  </Button>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typingIndicator">
                <div className="typingDot" />
                <div className="typingDot" />
                <div className="typingDot" />
              </div>
            )}
          </div>
          <Input
            className="chatbotInput"
            placeholder="Mesajınızı yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="chatbotButton"
            onClick={() => sendMessageToBot(message, selectedId)}
          >
            Gönder
          </Button>
        </div>
        {/* Robot listesi kısmı aynı kalacak */}
        {showRobots && (
          <div
            className="robotListContainer"
            style={{
              background: "#63b995",
              marginTop: "40px",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              position: "fixed",
              top: "330px",
              right: "150px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  style={{
                    margin: "20px",
                    textAlign: "center",
                    width: "160px",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Button
                    onClick={() => handleRobotSelection(robot.id)}
                    style={{
                      background: "rgb(64, 169, 125)",
                      borderRadius: "50%",
                      padding: "15px",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      marginBottom: "15px",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "scale(1.2)";
                      e.target.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                    }}
                  >
                    <RobotOutlined style={{ fontSize: "35px", color: "#fff" }} />
                  </Button>
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "15px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                      textAlign: "left",
                      marginLeft: "35px",
                    }}
                  >
                    {robot.ugvName}
                  </div>
                  {selectedId === robot.id && robotInfo && (
                    <Card
                      title="Robot Raporu"
                      bordered={false}
                      headStyle={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#333",
                      }}
                    >
                      <div style={{ marginTop: "5px" }}>
                        <strong style={{ fontSize: "10px" }}>Renk:</strong>{" "}
                        <span style={{ fontSize: "10px" }}>
                          {robotInfo.match(/Renk: (.*)/)[1]}
                        </span>
                      </div>
                      <div style={{ marginBottom: "5px" }}>
                        <strong style={{ fontSize: "10px" }}>Hız:</strong>{" "}
                        <span style={{ fontSize: "10px" }}>
                          {robotInfo.match(/Hız: (.*) km\/h/)[1]} km/h
                        </span>
                      </div>
                      <div style={{ marginBottom: "5px" }}>
                        <strong style={{ fontSize: "10px" }}>Konum:</strong>{" "}
                        <span style={{ fontSize: "10px" }}>
                          {robotInfo.match(/Konum: (.*)/)[1]}
                        </span>
                      </div>
                      <div style={{ marginBottom: "5px" }}>
                        <strong style={{ fontSize: "10px" }}>Son Çalıştırılma:</strong>{" "}
                        <span style={{ fontSize: "10px" }}>
                          {robotInfo.match(/Son Çalıştırılma: (.*)/)[1]}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: "10px" }}>Durum:</strong>{" "}
                        <span style={{ fontSize: "10px" }}>
                          {robotInfo.match(/Durum: (.*)/)[1]}
                        </span>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default CameraPage;






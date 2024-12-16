import React, { useEffect, useState } from "react";
import { Button, Col, Row, Flex } from "antd";
import Camera from "../components/CameraPage/Camera";
import LeftCamera from "../components/CameraPage/LeftCamera";
import RightCamera from "../components/CameraPage/RightCamera";
import CarList from "../components/MainPage/CarList";
import VehiclePage from "./VehiclePage";
import { useSelector, useDispatch } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice";
import ManuelMod from "../components/CameraPage/ManuelMode";
import { selectSelectedId } from "../redux/ugvSlice";
import { selectActiveCameras, removeCamera, toggleCamera } from "../redux/cameraSlice"; // toggleCamera eklenmiştir
function CameraPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);
  const selectedId = useSelector(selectSelectedId);
  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId));
  const dispatch = useDispatch(); // Redux dispatch

  // Chatbot state
  const [messages, setMessages] = useState([]); // Mesajları tutmak için state
  const [input, setInput] = useState(""); // Kullanıcı girişi için state
  const [selectedCarNo, setSelectedCarNo] = useState(null);
  const [robots, setRobots] = useState([]);

  const [responses, setResponses] = useState([
    "Merhaba! Size nasıl yardımcı olabilirim?",
    "Beni buraya çağırdığınız için teşekkürler!",
    "Sorularınızı bekliyorum!",
    "Ben bir chatbotum, her türlü sorunuza yardımcı olabilirim!",
    "İhtiyacınız olan bilgiyi sağlamak için buradayım!",
    "Sormak istediğiniz başka bir şey var mı?",
  ]); // Bot yanıtları için başlangıç durumu

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); // Mesaj gönderildikten sonra girişi temizle
      sendMessageToBot(input); // API'ye mesaj gönder
    }
  };

  const sendMessageToBot = async (message) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msg: message }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "bot" },
        ]);
      } else {
        const errorData = await res.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: errorData.error || 'Bir hata oluştu', sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Bağlantı hatası: ' + error.message, sender: "bot" },
      ]);
    }
  };

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

  // Genişlik değişkeni
  const chatWindowWidth = "200%"; // İstediğiniz genişliği buradan ayarlayabilirsiniz

  // ChatBot bileşeninin tanımı
  const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const sendMessageToBot = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ msg: message }),
        });

        if (res.ok) {
          const data = await res.json();
          setResponse(data.response);
        } else {
          const errorData = await res.json();
          setResponse(errorData.error || 'Bir hata oluştu');
        }
      } catch (error) {
        setResponse('Bağlantı hatası: ' + error.message);
      }
    };

    return (
      <Row style={styles.body}>
        <Col span={12}>
          <div style={styles.chatbotContainer}>
            {response ? <div style={styles.chatbotResponse}>{response}</div> : null}
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <Row style={{ height: "80vh" }}>
      <Col span={12}>
        <Flex justify="center" align="center" style={{ height: "100%" }} className="scroll-pl-6 snap-x">
          {showVehiclePage ? <VehiclePage setSelectedCarNo={setSelectedCarNo} /> : <CarList selectedCarNo={selectedCarNo} setSelectedCarNo={setSelectedCarNo} />}
        </Flex>
      </Col>
      <Col
        span={12}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl"
        style={{ height: "100%", display: "flex", flexDirection: "column", padding: "200px" }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px" }}>
          <Flex justify="center" align="center" style={{ height: "100%", flexDirection: "column" }}>
            {isManuel ? (
              <div style={{ marginTop: "-200px" }}>
                <ManuelMod />
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="chat-window" style={{ 
                  flex: "0 0 500px", // Sabit yükseklik ayarlandı
                  width: chatWindowWidth, // Genişlik değişkeni kullanıldı
                  overflowY: "auto", 
                  padding: "20px", 
                  border: "1px solid #ccc", 
                  borderRadius: "10px", 

                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundColor: "rgba(255, 255, 255, 0.5)", // Saydam beyaz arka plan rengi eklendi
                  marginTop: "-200px", 
                  marginLeft: "-120px"
                }}>
                  {messages.map((msg, index) => (
                    <div key={index} className={msg.sender} style={{ maxWidth: "70%", padding: "10px", borderRadius: "10px", margin: "5px 0", wordWrap: "break-word" }}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <ChatBot /> {/* ChatBot'u buraya entegre et */}
                <div style={{ display: "flex", marginTop: "10px" }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()} // Enter tuşuna basınca gönder
                    style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                  <button 
                    onClick={handleSend} 
                    style={{ 
                      marginLeft: "10px", 
                      padding: "10px", 
                      backgroundColor: "#4CAF50", // Buton arka plan rengi
                      color: "white", // Yazı rengi
                      border: "none", // Kenar yok
                      borderRadius: "5px", // Kenar yuvarlama
                      cursor: "pointer", // İmleç değişimi
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Gölge efekti
                      transition: "background-color 0.3s, transform 0.2s", // Geçiş efekti
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"} // Hover efekti
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"} // Hover çıkınca eski rengine dön
                  >
                    Gönder
                  </button>
                </div>
              </div>
            )}
          </Flex>
        </div>
      </Col>
    </Row>
  );
}

export default CameraPage;

// CSS Styles
const styles = `
.chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px; /* Kenarları yuvarlat */
    background-color: #f9f9f9; /* Arka plan rengi */
}

.user {
    align-self: flex-end;
    background-color: #d1e7dd; /* Kullanıcı mesaj rengi */
    padding: 10px; /* İç boşluk */
    border-radius: 10px; /* Kenarları yuvarlat */
    margin: 5px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Gölge efekti */
}

.bot {
    align-self: flex-start;
    background-color: #f8d7da; /* Bot mesaj rengi */
    padding: 10px; /* İç boşluk */
    border-radius: 10px; /* Kenarları yuvarlat */
    margin: 5px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Gölge efekti */
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

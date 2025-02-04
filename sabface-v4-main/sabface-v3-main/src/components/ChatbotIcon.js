import React, { useState, useEffect } from "react";
import axios from "axios";
import robotIcon from "../img/robot.svg";
import { useNavigate } from "react-router-dom";
import { BsTrash } from 'react-icons/bs'; 


const ChatbotIcon = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const [inputMessage, setInputMessage] = useState("");
  const [robotData, setRobotData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const toggleChat = () => setChatOpen((prev) => !prev);

  const goToMainChatbot = () => {
    // Mini chatbot mesajlarını ana chatbot için localStorage'a kaydet
    const miniChatMessages = localStorage.getItem('miniChatMessages');
    if (miniChatMessages) {
      // Ana chatbot'un mevcut mesajlarını al
      const mainChatMessages = localStorage.getItem('chatMessages');
      const existingMessages = mainChatMessages ? JSON.parse(mainChatMessages) : [];
      
      // Mini chatbot mesajlarını ekle
      const miniMessages = JSON.parse(miniChatMessages);
      const updatedMessages = [...existingMessages, ...miniMessages];
      
      // Güncellenmiş mesajları ana chatbot için kaydet
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    }
    
    // Ana chatbot sayfasına yönlendir
    navigate("/Camera");
  };

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('miniChatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  useEffect(() => {
    localStorage.setItem('miniChatMessages', JSON.stringify(messages));
  }, [messages]);

  // Mesajları temizleme fonksiyonu
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('miniChatMessages');
  };


  useEffect(() => {
    
    const fetchRobots = async () => {
      try {
        console.log("Robotlar getiriliyor...");
        const res = await axios.get("http://127.0.0.1:5000/get_robots");
        console.log("Gelen robot verisi:", res.data);
        setRobotData(res.data);
      } catch (error) {
        console.error("Robot verilerini alırken hata oluştu:", error);
      }
    };

    fetchRobots();
  }, []);

  // robotData değişikliklerini izle
  useEffect(() => {
    console.log("Güncel robotData:", robotData);
  }, [robotData]);

  const selectRobot = async (id) => {
    console.log("Seçilen robot ID:", id);
    setSelectedId(id);

    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_robot_info/${id}`);
      console.log("Robot bilgi yanıtı:", res.data);
      if (res.status === 200) {
        const data = res.data;
        const robotInfoMessage = `Robot ${data.ugvName} temel bilgileri:\nKonum: ${data.carLat}, ${data.carLong}`;

        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: robotInfoMessage, 
            sender: "bot", 
            icon: robotIcon,
            showMainChatButton: true,
            additionalText: "Daha detaylı bilgi alabilmek için ana chatbota geçebilirsiniz"
          },
        ]);
      } else {
        console.error("Robot bilgileri alınamadı");
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error.message);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    sendMessageToBot(inputMessage, selectedId);
    setInputMessage("");
  };

  const sendMessageToBot = async (message, selectedId) => {
    if (!message) return;

    // Kullanıcı mesajını ekle
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user", icon: robotIcon },
    ]);

    try {
      console.log("Mesaj gönderiliyor:", message, "Selected ID:", selectedId);
      const res = await axios.post("http://127.0.0.1:5000/chatbot", {
        msg: message,
        selectedId: selectedId,
      });
      console.log("Chatbot yanıtı:", res.data);

      if (res.status === 200) {
        const data = res.data;
        console.log("Context:", data.currentContext); // Debug için eklendi

        // Eğer mesaj "rapor" içeriyorsa veya context robot_sorgulama ise
        if (message.toLowerCase().includes('rapor') || data.currentContext === "robot_sorgulama") {
          console.log("Robot seçimi gösteriliyor");
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Lütfen bir robot seçiniz:",
              sender: "bot",
              icon: robotIcon,
              buttons: true
            },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.response, sender: "bot", icon: robotIcon },
          ]);
        }
      }
    } catch (error) {
      console.error("Backend bağlantı hatası:", error.message);
    }
  };

  return (
    <div>
      {chatOpen && (
        <div className="fixed bottom-16 right-4 w-72 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
            <span>Chatbot</span>
            <div>
              <button
                className="text-white text-sm mr-2 hover:text-red-300 transition-colors"
                onClick={clearMessages}
                title="Sohbeti Temizle" >
                <BsTrash size={16} />
              </button>
              <button
                className="text-white text-xl"
                onClick={() => setChatOpen(false)}
              >
                ×
              </button>
            </div>
          </div>
  
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>
                
                {msg.showMainChatButton && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">{msg.additionalText}</p>
                    <button
                      onClick={goToMainChatbot}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Ana Chatbot'a Git
                    </button>
                  </div>
                )}
              </div>
            ))}
  
            {/* Robot Butonları - Daha basit kontrol */}
            {messages.some(msg => msg.buttons) && (
                <div className="mt-4">
                  {robotData.map((robot) => (
                    <button
                      key={robot.id}
                      onClick={() => selectRobot(robot.id)}
                      className="bg-gray-300 text-black p-2 m-1 rounded-lg"
                    >
                      {robot.ugvName}
                    </button>
                  ))}
                </div>
            )}
          </div>
  
          <div className="p-2 flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Mesaj yazın..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
  
      <div
        className="fixed bottom-4 right-4 cursor-pointer flex flex-col items-center"
        style={{ zIndex: 9999 }}
        onMouseEnter={() => setShowMessage(true)}
        onMouseLeave={() => setShowMessage(false)}
      >
        {showMessage && !chatOpen && (
          <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white text-sm shadow-lg transition-opacity duration-300">
            Hey! Yardıma mı ihtiyacınız var?
          </div>
        )}
  
        <div className="relative" onClick={toggleChat}>
          <img src={robotIcon} alt="Chatbot Icon" className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default ChatbotIcon;
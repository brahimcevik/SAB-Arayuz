import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useSelector } from "react-redux";
import { selectSelectedId } from "../redux/ugvSlice";
import CarList from "../components/MainPage/CarList";

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
    <View style={{ padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Mesajınızı yazın..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Gönder" onPress={sendMessageToBot} />
      {response ? <Text style={{ marginTop: 20 }}>{response}</Text> : null}
    </View>
  );
};

export default ChatBot;

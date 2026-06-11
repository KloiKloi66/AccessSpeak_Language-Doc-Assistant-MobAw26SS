import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';

export default function ChatBotPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async () => {
    console.log('BUTTON GEDRÜCKT');

    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
    };

    setMessages(prev => [...prev, userMessage]);

    const currentMessage = message;
    setMessage('');

    try {
      console.log('FETCH START');

      const response = await fetch(
        'http://*Hier lokale IP Adresse Einfügen:8000/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      );

      console.log('STATUS:', response.status);

      const data = await response.json();

      console.log('DATA:', data);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response,
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.log('FEHLER:', error);
    }
  };

  return (
    <View style={styles.mainView}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'user'
                ? styles.userBubble
                : styles.botBubble,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Nachricht eingeben..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text>Senden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 10,
  },

  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1ffd6',
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#eeeeee',
  },

  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
});
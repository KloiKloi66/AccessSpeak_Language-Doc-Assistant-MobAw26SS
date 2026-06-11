import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
} from 'react-native';

import PageHeader from '../../components/page-header.component';
import Button from '../../components/button.component';

import FontAwesome from '@expo/vector-icons/FontAwesome';

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
        'http://10.149.133.22:8000/chat',
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
      <PageHeader>Chatbot</PageHeader>
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

        <Button onPress={sendMessage}>
          <FontAwesome name="send-o" size={24} color="black" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 10
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    paddingHorizontal: 4
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  }
});
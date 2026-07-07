import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useRoute } from '@react-navigation/native';

import PageHeader from '../../components/page-header.component';
import { COLORS, RADIUS, SPACING } from '../../theme';

import Ionicons from '@expo/vector-icons/Ionicons';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const BACKEND_URL = `http://${devHost}:8001`; // for use with physical device on same network
// const BACKEND_URL = `http://10.0.2.2:8001`; // for android emulator

export default function ChatBotPage() {
  const route = useRoute<any>();

  const documentContext = route.params?.documentContext ?? "";

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<any[]>(() => {
    if (documentContext) {
      return [
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: `Ich habe das gescannte Dokument erhalten. Hier ist die Analyse:\n\n${documentContext}`,
        },
      ];
    }

    return [];
  });

  const sendMessage = async () => {
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
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          document_context: documentContext,
        }),
      });

      const data = await response.json();

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
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
    >
      <PageHeader>Chatbot</PageHeader>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                item.sender === 'user' ? styles.userText : styles.botText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Texteingabe"
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} activeOpacity={0.7}>
          <Ionicons name="arrow-forward" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: COLORS.text,
  },
  userText: {
    color: COLORS.text,
  },

  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    color: COLORS.text,
    fontSize: 16,
  },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
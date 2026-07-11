import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import PageHeader from '@components/page-header.component';
import Button from '@components/button.component';
import { COLORS, RADIUS, SPACING } from '@theme';
import { AI_URL as BACKEND_URL } from '@utils/backendConfig';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function ChatBotPage() {
  const params = useLocalSearchParams<{ scanContext?: string }>();
  const scanContext = typeof params.scanContext === 'string' ? params.scanContext : '';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Tab screens stay mounted, so a lazy useState initializer would only run
  // on the very first visit. This effect adds the intro message every time
  // a (new) scan context arrives.
  useEffect(() => {
    if (scanContext) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: `Ich habe dein gescanntes Dokument erhalten:\n\n${scanContext}\n\nWas möchtest du dazu wissen?`,
        },
      ]);
    }
  }, [scanContext]);

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
          document_context: scanContext,
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

      <View style={styles.chatContainer}>
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
          <Button 
            style={styles.sendBtn} 
            onPress={sendMessage}
            shape="circle"
            size="medium"
          >
            <Ionicons name="arrow-forward" size={22} color={COLORS.text} />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: SPACING.md,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
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
    backgroundColor: COLORS.accent,
  },
});
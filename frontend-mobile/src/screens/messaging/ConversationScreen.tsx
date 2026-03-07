import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const WS_URL = 'http://localhost:8081/ws-chat';

export default function ConversationScreen({ route, navigation }: any) {
  const { conversationId, chatName } = route.params || { conversationId: 'default', chatName: 'Chat' };
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: chatName });
    fetchMessageHistory();
    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [conversationId]);

  const fetchMessageHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
    });
    client.activate();
    stompClient.current = client;
  };

  const sendMessage = () => {
    if (!inputText.trim() || !stompClient.current?.connected) return;

    const messageData = {
      conversationId,
      senderId: userId,
      content: inputText.trim(),
    };

    stompClient.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(messageData),
    });

    setInputText('');
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.senderId === userId;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#07C160" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          inverted={false}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: { padding: 16 },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#07C160',
    borderBottomRightRadius: 2,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
  },
  messageText: { fontSize: 16 },
  myMessageText: { color: '#FFFFFF' },
  theirMessageText: { color: '#000000' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#07C160',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

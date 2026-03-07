import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function RuntimeWebViewScreen({ route, navigation }: any) {
  const { app } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [bridgeScript, setBridgeScript] = useState('');
  const { session } = useAuthStore();

  useEffect(() => {
    navigation.setOptions({ title: app.name });
    fetchBridge();
  }, [app]);

  const fetchBridge = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sandbox/bridge.js`);
      setBridgeScript(response.data);
    } catch (error) {
      console.error('Error fetching JS bridge:', error);
    }
  };

  const onMessage = (event: any) => {
    try {
      const { type, data } = JSON.parse(event.nativeEvent.data);
      console.log('Message from Mini-App:', type, data);

      switch (type) {
        case 'CHAT_SEND':
          Alert.alert('Mini-App Action', `Sending Message: ${data}`);
          break;
        case 'PAYMENT_REQ':
          Alert.alert('Payment Request', `Amount: $${data}`);
          break;
        case 'PROFILE_GET':
          const profileData = JSON.stringify({
            userId: session?.user?.id,
            email: session?.user?.email
          });
          webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new CustomEvent('WITS_PROFILE_DATA', { detail: ${profileData} }));
          `);
          break;
        default:
          console.warn('Unknown message type:', type);
      }
    } catch (e) {
      console.error('Error parsing bridge message:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: app.url || 'https://google.com' }} // Fallback for demo
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            setLoading(false);
            if (bridgeScript) {
              webViewRef.current?.injectJavaScript(bridgeScript);
            }
          }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#07C160" />
              <Text style={styles.loadingText}>Loading {app.name}...</Text>
            </View>
          )}
        />
      </View>

      {/* Mini-App Control Bar (Floating) */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-circle" size={36} color="#00000080" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  webViewWrapper: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: { marginTop: 15, fontSize: 16, color: '#666' },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100
  }
});

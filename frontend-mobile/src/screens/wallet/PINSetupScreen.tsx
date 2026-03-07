import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function PINSetupScreen({ navigation }: any) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1: Enter PIN, 2: Confirm PIN
  const [loading, setLoading] = useState(false);
  const { session } = useAuthStore();

  const handleKeyPress = (val: string) => {
    if (val === 'back') {
      if (step === 1) setPin(prev => prev.slice(0, -1));
      else setConfirmPin(prev => prev.slice(0, -1));
      return;
    }

    if (step === 1) {
      if (pin.length < 6) {
        const newPin = pin + val;
        setPin(newPin);
        if (newPin.length === 6) {
          setTimeout(() => setStep(2), 300);
        }
      }
    } else {
      if (confirmPin.length < 6) {
        const newPin = confirmPin + val;
        setConfirmPin(newPin);
        if (newPin.length === 6) {
          handleSubmit(newPin);
        }
      }
    }
  };

  const handleSubmit = async (finalConfirm: string) => {
    if (pin !== finalConfirm) {
      Alert.alert("Error", "PINs do not match. Please start over.", [
        { text: "Retry", onPress: () => { setPin(''); setConfirmPin(''); setStep(1); } }
      ]);
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/wallet/setup-pin`, {
        userId: session?.user?.id,
        pin: pin
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      Alert.alert("Success", "Wallet PIN has been set up successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("PIN Error:", error);
      Alert.alert("Error", "Failed to set up PIN. Please try again.");
      setPin(''); setConfirmPin(''); setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const PinDots = ({ value }: { value: string }) => (
    <View style={styles.dotsRow}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={[styles.dot, value.length > i && styles.dotFilled]} />
      ))}
    </View>
  );

  const Keypad = () => (
    <View style={styles.keypad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((val, i) => (
        <TouchableOpacity
          key={i}
          style={styles.key}
          onPress={() => handleKeyPress(val.toString())}
          disabled={val === ''}
        >
          {val === 'back' ? (
            <Ionicons name="backspace-outline" size={32} color="#1a1a1a" />
          ) : (
            <Text style={styles.keyText}>{val}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark" size={64} color="#07C160" />
        <Text style={styles.title}>{step === 1 ? 'Create Wallet PIN' : 'Confirm Wallet PIN'}</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? 'Set a 6-digit PIN to secure your transactions and payments.'
            : 'Please re-enter your 6-digit PIN to confirm.'}
        </Text>

        <PinDots value={step === 1 ? pin : confirmPin} />
        {loading && <ActivityIndicator size="small" color="#07C160" style={{ marginTop: 20 }} />}
      </View>

      <Keypad />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginTop: 30 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 22 },
  dotsRow: { flexDirection: 'row', marginTop: 40, gap: 15 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  dotFilled: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 40 },
  key: { width: '33.33%', height: 80, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 28, color: '#1a1a1a' }
});

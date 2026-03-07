import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { insforge } from "../../lib/insforge";
import { useAuthStore } from '../../store/authStore';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state: any) => state.setSession);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
      }
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_sk5h1763.json' }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to WITS</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  form: { gap: 16 },
  input: { height: 56, backgroundColor: "#f5f5f5", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: "#1a1a1a" },
  button: { height: 56, backgroundColor: "#07C160", borderRadius: 12, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#07C160", fontWeight: "500" },
  animationContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  lottie: {
    width: 200,
    height: 200,
  }
});

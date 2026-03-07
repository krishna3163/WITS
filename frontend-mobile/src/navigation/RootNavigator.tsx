import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import Onboarding1Screen from '../screens/auth/Onboarding1Screen';
import SplashScreen from '../screens/auth/SplashScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { session, loading } = useAuthStore();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        // Protected App Flow
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        // Auth Flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
        </>
      )}
    </Stack.Navigator>
  );
}

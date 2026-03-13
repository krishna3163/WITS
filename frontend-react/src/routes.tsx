import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomeDashboard from './features/home/HomeDashboard';
import ChatScreen from './features/chat/ChatScreen';
import Discover from './features/discover/Discover';
import ShakeToFind from './features/discover/ShakeToFind';
import MiniappStore from './features/miniapps/MiniappStore';
import MorePage from './features/more/MorePage';
import SettingsPage from './features/settings/SettingsPage';
import WelcomeScreen from './features/auth/WelcomeScreen';
import LoginScreen from './features/auth/LoginScreen';
import SignUpScreen from './features/auth/SignUpScreen';
import ChatDetail from './features/chat/ChatDetail';
import ContactList from './features/contacts/ContactList';
import MomentsFeed from './features/moments/MomentsFeed';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/app" element={<RootLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomeDashboard />} />
        <Route path="chat" element={<ChatScreen />} />
        <Route path="chat/:id" element={<ChatDetail />} />
        <Route path="contacts" element={<ContactList />} />
        <Route path="discover" element={<Discover />} />
        <Route path="discover/shake" element={<ShakeToFind />} />
        <Route path="moments" element={<MomentsFeed />} />
        <Route path="store" element={<MiniappStore />} />
        <Route path="more" element={<MorePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;

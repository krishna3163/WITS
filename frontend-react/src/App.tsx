import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ChatScreen from './features/chat/ChatScreen';
import MomentsFeed from './features/feed/MomentsFeed';
import MiniappStore from './features/miniapps/MiniappStore';
import WalletScreen from './features/wallet/WalletScreen';
import LoginScreen from './features/auth/LoginScreen';
import SignUpScreen from './features/auth/SignUpScreen';
import WelcomeScreen from './features/auth/WelcomeScreen';
import ContactList from './features/contacts/ContactList';
import ProfilePage from './features/profile/ProfilePage';
import PremiumStore from './features/store/PremiumStore';
import NotesApp from './features/notes/NotesApp';
import AIChatbot from './features/ai/AIChatbot';
import Communities from './features/communities/Communities';
import CRMApp from './features/crm/CRMApp';
import StatusTab from './features/chat/StatusTab';
import Discover from './features/discover/Discover';
import HomeDashboard from './features/home/HomeDashboard';
import MorePage from './features/more/MorePage';
import SearchScreen from './features/search/SearchScreen';
import FavoritesPage from './features/favorites/FavoritesPage';
import SettingsPage from './features/settings/SettingsPage';
import InitializationScreen from './features/mobile/InitializationScreen';
import ShakeFeature from './features/discover/ShakeFeature';
import { SettingsThemeApply } from './components/SettingsThemeApply';
import { ToastProvider } from './context/ToastContext';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { useSettingsCloudSync } from './hooks/useSettingsCloudSync';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Simple initialization check for the mobile app experience
  React.useEffect(() => {
    const initialized = localStorage.getItem('wits_initialized');
    if (initialized) setIsInitialized(true);
  }, []);

  if (!isInitialized && location.pathname !== '/init') {
    return <Navigate to="/init" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { checkSession } = useAuthStore();
  const { settings } = useSettingsStore();

  useSettingsCloudSync();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const root = window.document.documentElement;
    const appTheme = settings.appearance?.theme ?? 'system';
    const isDark = appTheme === 'dark' || appTheme === 'amoled' || (appTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.appearance?.theme]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <SettingsThemeApply />
        <Routes>
        {/* Initialization Flow */}
        <Route path="/init" element={<InitializationScreen />} />

        {/* Auth Route (No Nav Bars) */}
        <Route path="/auth/welcome" element={<WelcomeScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/signup" element={<SignUpScreen />} />

        {/* Main App Routes (Protected & Includes Nav Bars) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/chats" replace />} />
          <Route path="chats" element={<ChatScreen />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="moments" element={<MomentsFeed />} />
          <Route path="discover" element={<Discover />} />
          <Route path="market" element={<MiniappStore />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="dashboard" element={<HomeDashboard />} />
          <Route path="updates" element={<StatusTab />} />

          {/* Detailed Features */}
          <Route path="wallet" element={<WalletScreen />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="store" element={<PremiumStore />} />
          <Route path="notes" element={<NotesApp />} />
          <Route path="ai" element={<AIChatbot />} />
          <Route path="communities" element={<Communities />} />
          <Route path="crm" element={<CRMApp />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="explorer" element={<Discover />} />
          <Route path="discover/shake" element={<ShakeFeature />} />
        </Route>
      </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

import React, { useEffect } from 'react';
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
import { useAuthStore } from './store/authStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

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

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="discover" element={<MiniappStore />} />
          <Route path="wallet" element={<WalletScreen />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

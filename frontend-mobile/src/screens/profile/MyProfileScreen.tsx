import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function MyProfileScreen({ navigation }: any) {
  const { session, signOut } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${session.user.id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setProfile(response.data);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: signOut }
      ]
    );
  };

  const ProfileItem = ({ icon, label, value, onPress, color = "#1a1a1a" }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.icon} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#07C160" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile Info */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate('EditProfileScreen', { profile })}
      >
        <Image
          source={{ uri: profile?.avatarUrl || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile?.username || 'Super User'}</Text>
          <Text style={styles.email}>{session?.user?.email}</Text>
          <View style={styles.qrBadge}>
            <Ionicons name="qr-code-outline" size={16} color="#666" />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      {/* Stats/Quick Actions */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>Moments</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statValue}>1.2k</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>450</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content & Activity</Text>
        <ProfileItem icon="bookmark-outline" label="Saved Posts" onPress={() => navigation.navigate('SavedPostsScreen')} />
        <ProfileItem icon="time-outline" label="Archive" onPress={() => navigation.navigate('StoriesArchiveScreen')} />
        <ProfileItem icon="heart-outline" label="Liked Content" onPress={() => { }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security & Privacy</Text>
        <ProfileItem icon="lock-closed-outline" label="Account Security" onPress={() => navigation.navigate('SecurityScreen')} />
        <ProfileItem icon="eye-off-outline" label="Privacy Settings" onPress={() => navigation.navigate('PrivacyScreen')} />
        <ProfileItem icon="shield-checkmark-outline" label="Verification" onPress={() => { }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Ionicons name="moon-outline" size={22} color="#1a1a1a" style={styles.icon} />
            <Text style={styles.label}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: "#eee", true: "#07C160" }}
          />
        </View>
        <ProfileItem icon="language-outline" label="Language" value="English" onPress={() => navigation.navigate('LanguageScreen')} />
        <ProfileItem icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('ProfileNotificationsScreen')} />
      </View>

      <View style={styles.section}>
        <ProfileItem
          icon="log-out-outline"
          label="Sign Out"
          onPress={handleSignOut}
          color="#FF3B30"
        />
      </View>

      <Text style={styles.versionText}>WITS v1.0.0 (Stable)</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff'
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
  headerInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  qrBadge: { marginTop: 8 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0'
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f0f0f0' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 2 },
  section: { marginTop: 20, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#999', marginHorizontal: 20, marginVertical: 10, textTransform: 'uppercase' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0'
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15 },
  label: { fontSize: 16, color: '#1a1a1a' },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 14, color: '#999', marginRight: 8 },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 40, marginBottom: 20 }
});

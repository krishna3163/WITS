import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function MiniAppStoreScreen({ navigation }: any) {
  const [miniApps, setMiniApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { session } = useAuthStore();

  useEffect(() => {
    fetchMiniApps();
  }, []);

  const fetchMiniApps = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/miniapps`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setMiniApps(response.data);
    } catch (error) {
      console.error('Error fetching miniapps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = miniApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAppItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.appCard}
      onPress={() => navigation.navigate('MiniAppDetailScreen', { appId: item.id })}
    >
      <View style={styles.iconContainer}>
        {item.iconUrl ? (
          <Image source={{ uri: item.iconUrl }} style={styles.appIcon} />
        ) : (
          <View style={[styles.appIcon, styles.iconPlaceholder]}>
            <Ionicons name="cube-outline" size={32} color="#07C160" />
          </View>
        )}
      </View>
      <Text style={styles.appName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.appCategory}>{item.description || 'Utility'}</Text>
      <TouchableOpacity style={styles.openBtn} onPress={() => navigation.navigate('RuntimeWebViewScreen', { app: item })}>
        <Text style={styles.openBtnText}>Open</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mini-App Store</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mini-apps..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredList}>
            {miniApps.slice(0, 3).map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.featuredCard}
                onPress={() => navigation.navigate('RuntimeWebViewScreen', { app: app })}
              >
                <Image
                  source={{ uri: app.iconUrl || 'https://via.placeholder.com/150' }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredName}>{app.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Apps Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore All</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#07C160" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredApps}
              keyExtractor={(item) => item.id}
              renderItem={renderAppItem}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              ListEmptyComponent={<Text style={styles.emptyText}>No mini-apps found</Text>}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 44
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  featuredList: { marginHorizontal: -20, paddingLeft: 20 },
  featuredCard: {
    width: 280,
    height: 160,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  featuredImage: { width: '100%', height: '100%', opacity: 0.7 },
  featuredOverlay: { position: 'absolute', bottom: 15, left: 15 },
  featuredName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  gridRow: { justifyContent: 'flex-start', gap: 10 },
  appCard: { width: '31%', alignItems: 'center', marginBottom: 20 },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appIcon: { width: 70, height: 70, borderRadius: 18 },
  iconPlaceholder: { backgroundColor: '#E8F5E9' },
  appName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' },
  appCategory: { fontSize: 11, color: '#888', textAlign: 'center' },
  openBtn: { marginTop: 8, backgroundColor: '#07C160', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  openBtnText: { color: 'white', fontSize: 12, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20, gridRow: 'span 3' }
});

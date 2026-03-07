import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function DiscoverSearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, USERS, GROUPS, POSTS
  const [results, setResults] = useState<any>({ users: [], groups: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const { session } = useAuthStore();

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults({ users: [], groups: [], posts: [] });
      return;
    }

    try {
      setLoading(true);
      const authHeader = { Authorization: `Bearer ${session?.access_token}` };

      // Perform multi-search concurrently
      const [usersRes, groupsRes, postsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users/search?q=${text}`, { headers: authHeader }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/conversations/search?q=${text}`, { headers: authHeader }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/feed/search?q=${text}`, { headers: authHeader }).catch(() => ({ data: [] }))
      ]);

      setResults({
        users: usersRes.data || [],
        groups: groupsRes.data || [],
        posts: postsRes.data || []
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: any) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <Image source={{ uri: item.avatarUrl || 'https://via.placeholder.com/50' }} style={styles.avatar} />
      <View>
        <Text style={styles.itemName}>{item.username}</Text>
        <Text style={styles.itemMeta}>User • {item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderGroup = ({ item }: any) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('Conversation', { conversationId: item.id, chatName: item.name })}>
      <View style={[styles.avatar, styles.groupIcon]}>
        <Ionicons name="people" size={24} color="#666" />
      </View>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>Group • {item.participantCount || 0} members</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: any) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => { }}>
      <Image source={{ uri: (item.mediaUrl && item.mediaUrl.length > 0) ? item.mediaUrl[0] : 'https://via.placeholder.com/50' }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName} numberOfLines={1}>{item.content}</Text>
        <Text style={styles.itemMeta}>Post • {item.username || 'Anonymous'}</Text>
      </View>
    </TouchableOpacity>
  );

  const Tab = ({ label, id }: any) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === id && styles.activeTab]}
      onPress={() => setActiveTab(id)}
    >
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  const combinedResults = [
    ...(activeTab === 'ALL' || activeTab === 'USERS' ? results.users.map((u: any) => ({ ...u, type: 'USER' })) : []),
    ...(activeTab === 'ALL' || activeTab === 'GROUPS' ? results.groups.map((g: any) => ({ ...g, type: 'GROUP' })) : []),
    ...(activeTab === 'ALL' || activeTab === 'POSTS' ? results.posts.map((p: any) => ({ ...p, type: 'POST' })) : [])
  ];

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search People, Groups, & Posts"
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tab label="All" id="ALL" />
        <Tab label="Users" id="USERS" />
        <Tab label="Groups" id="GROUPS" />
        <Tab label="Posts" id="POSTS" />
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#07C160" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={combinedResults}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => {
            if (item.type === 'USER') return renderUser({ item });
            if (item.type === 'GROUP') return renderGroup({ item });
            return renderPost({ item });
          }}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length > 1 ? (
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 44
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5
  },
  tab: { paddingVertical: 10, paddingHorizontal: 15, marginRight: 5 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#07C160' },
  tabText: { fontSize: 15, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#07C160', fontWeight: 'bold' },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  resultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  groupIcon: { backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }
});

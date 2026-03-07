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
  SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function ContactsListScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchContacts();
    }
  }, [userId]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contacts/${userId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group contacts by first letter for SectionList
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const letter = (contact.contactName || contact.username || "?").charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {});

  const sections = Object.keys(groupedContacts)
    .sort()
    .map(letter => ({
      title: letter,
      data: groupedContacts[letter].sort((a, b) => (a.contactName || a.username).localeCompare(b.contactName || b.username))
    }));

  const renderContactItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactProfileScreen', { contact: item })}
    >
      <View style={styles.avatar}>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{(item.contactName || item.username || "?")[0].toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.contactName || item.username}</Text>
        <Text style={styles.contactStatus}>{item.status === 'ACCEPTED' ? 'Online' : 'Pending'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.actionItems}>
        <TouchableOpacity style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFB800' }]}>
            <Ionicons name="person-add" size={24} color="white" />
          </View>
          <Text style={styles.actionLabel}>Friend Requests</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: '#07C160' }]}>
            <Ionicons name="people" size={24} color="white" />
          </View>
          <Text style={styles.actionLabel}>Group Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <View style={[styles.actionIcon, { backgroundColor: '#2B84FF' }]}>
            <Ionicons name="pricetag" size={24} color="white" />
          </View>
          <Text style={styles.actionLabel}>Tags</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#07C160" style={{ marginTop: 50 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  actionItems: { paddingHorizontal: 16, marginBottom: 8 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0'
  },
  actionIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionLabel: { fontSize: 16, color: '#1A1A1A', flex: 1 },
  badge: { backgroundColor: '#F44336', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  sectionHeader: { backgroundColor: '#F7F7F7', paddingHorizontal: 16, paddingVertical: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#888' },
  contactItem: { flexDirection: 'row', padding: 12, paddingHorizontal: 16, alignItems: 'center' },
  avatar: { marginRight: 15 },
  avatarImg: { width: 44, height: 44, borderRadius: 6 }, // WeChat style slightly rounded rect
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 6, backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  contactInfo: { flex: 1, justifyContent: 'center' },
  contactName: { fontSize: 17, fontWeight: '500', color: '#1A1A1A' },
  contactStatus: { fontSize: 13, color: '#999', marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 }
});

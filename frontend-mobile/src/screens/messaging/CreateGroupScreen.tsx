import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function CreateGroupScreen({ navigation }: any) {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);

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
      console.error('Fetch contacts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (contactId: string) => {
    setSelectedIds(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const createGroup = async () => {
    if (selectedIds.length < 2) {
      Alert.alert("Error", "Please select at least 2 members for a group.");
      return;
    }
    if (!groupName.trim()) {
      Alert.alert("Error", "Please provide a group name.");
      return;
    }

    try {
      setCreating(true);
      // Backend expects List of UUIDs
      const allParticipantIds = [userId, ...selectedIds];

      const response = await axios.post(`${API_BASE_URL}/api/conversations/create`, allParticipantIds, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      // Update Group Name if we had an endpoint or just navigate
      Alert.alert("Success", "Group created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error('Create group error:', error);
      Alert.alert("Error", "Failed to create group.");
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const isSelected = selectedIds.includes(item.contactId);
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleSelection(item.contactId)}
      >
        <Ionicons
          name={isSelected ? "checkbox" : "square-outline"}
          size={24}
          color={isSelected ? "#07C160" : "#ccc"}
        />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.contactName ? item.contactName[0].toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.contactName}>{item.contactName || item.username}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.nameInput}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity
          style={[styles.createBtn, selectedIds.length < 2 && styles.disabledBtn]}
          onPress={createGroup}
          disabled={creating || selectedIds.length < 2}
        >
          {creating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.createBtnText}>Create</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.selector}>
        <Text style={styles.selectorTitle}>Select Members ({selectedIds.length})</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#07C160" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.contactId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No contacts found</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 50
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 10
  },
  createBtn: {
    backgroundColor: '#07C160',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  disabledBtn: { backgroundColor: '#ccc' },
  createBtnText: { color: "#fff", fontWeight: 'bold' },
  selector: { flex: 1, padding: 20 },
  selectorTitle: { fontSize: 13, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginBottom: 15 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 },
  avatarText: { fontWeight: 'bold', color: '#666' },
  contactName: { fontSize: 16, color: '#1a1a1a' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' }
});

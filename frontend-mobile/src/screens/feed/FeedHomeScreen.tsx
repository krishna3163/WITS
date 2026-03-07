import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_BASE_URL = 'http://localhost:8080';

export default function FeedHomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    fetchFeed();
  }, [session]);

  const fetchFeed = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/feed/${session.user.id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setPosts(response.data);
    } catch (err) {
      console.error("Feed Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.userName}>Anonymous User</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      {item.mediaUrl && (
        <Image source={{ uri: item.mediaUrl }} style={styles.postImage} />
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Like</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Comment</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#07C160" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No moments yet. Start by sharing your first post!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingVertical: 12 },
  postCard: { backgroundColor: "#fff", marginBottom: 12, padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#e1e4e8", marginRight: 12 },
  userName: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  time: { fontSize: 12, color: "#888", marginTop: 2 },
  content: { fontSize: 15, color: "#333", lineHeight: 22, marginBottom: 12 },
  postImage: { width: "100%", height: 300, borderRadius: 12, marginBottom: 12 },
  actions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  actionBtn: { marginRight: 24 },
  actionText: { color: "#666", fontWeight: "500" },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { color: "#999", textAlign: "center", fontSize: 15 }
});

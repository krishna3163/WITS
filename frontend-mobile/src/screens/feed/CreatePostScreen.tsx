import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_BASE_URL = 'http://localhost:8080';

export default function CreatePostScreen({ navigation }: any) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuthStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert("Empty Post", "Please add some text or an image.");
      return;
    }

    try {
      setLoading(true);
      let mediaUrl = null;

      // 1. Upload Image if exists
      if (image) {
        const formData = new FormData();
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', { uri: image, name: filename, type } as any);

        const uploadRes = await axios.post(`${API_BASE_URL}/api/media/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        mediaUrl = uploadRes.data.url;
      }

      // 2. Create Post
      await axios.post(`${API_BASE_URL}/api/feed/create`, {
        userId: session?.user?.id,
        content: content.trim(),
        mediaUrl: mediaUrl,
        type: image ? 'IMAGE' : 'TEXT'
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      Alert.alert("Success", "Moment shared successfully!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Post Error:", error);
      Alert.alert("Error", "Failed to share moment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.postButton, (!content.trim() && !image) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={loading || (!content.trim() && !image)}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.postButtonText}>Post</Text>}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImage} onPress={() => setImage(null)}>
              <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolItem} onPress={pickImage}>
            <Ionicons name="image-outline" size={28} color="#07C160" />
            <Text style={styles.toolLabel}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolItem}>
            <Ionicons name="videocam-outline" size={28} color="#2B84FF" />
            <Text style={styles.toolLabel}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolItem}>
            <Ionicons name="location-outline" size={28} color="#FF9500" />
            <Text style={styles.toolLabel}>Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 10 },
  cancelText: { fontSize: 16, color: '#666' },
  postButton: { backgroundColor: '#07C160', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  postButtonDisabled: { backgroundColor: '#A5E0C1' },
  postButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  input: { fontSize: 18, color: '#1a1a1a', minHeight: 120, textAlignVertical: 'top' },
  imagePreviewContainer: { marginTop: 20, position: 'relative' },
  imagePreview: { width: '100%', height: 250, borderRadius: 12 },
  removeImage: { position: 'absolute', top: 10, right: 10 },
  toolbar: { flexDirection: 'row', marginTop: 40, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 20, gap: 30 },
  toolItem: { alignItems: 'center' },
  toolLabel: { fontSize: 12, color: '#666', marginTop: 4 }
});

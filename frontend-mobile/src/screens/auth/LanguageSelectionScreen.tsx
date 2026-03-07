import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'zh', name: 'Chinese', nativeName: '中文' },
];

export default function LanguageSelectionScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();

  const handleSelectLanguage = async (langId: string) => {
    await i18n.changeLanguage(langId);
    await AsyncStorage.setItem('user-language', langId);
    navigation.goBack();
  };

  const renderItem = ({ item }: any) => {
    const isSelected = i18n.language === item.id;
    return (
      <TouchableOpacity
        style={styles.langItem}
        onPress={() => handleSelectLanguage(item.id)}
      >
        <View>
          <Text style={styles.langName}>{item.name}</Text>
          <Text style={styles.nativeName}>{item.nativeName}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#07C160" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('select_language')}</Text>
      </View>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 24, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a1a1a" },
  list: { paddingHorizontal: 20 },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  langName: { fontSize: 18, fontWeight: '500', color: '#1a1a1a' },
  nativeName: { fontSize: 14, color: '#888', marginTop: 4 }
});

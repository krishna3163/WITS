import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileActivityScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>ProfileActivityScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" }
});

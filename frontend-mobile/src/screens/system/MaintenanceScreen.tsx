import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>MaintenanceScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" }
});

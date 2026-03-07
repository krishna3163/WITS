import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SavingsGoalsScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>SavingsGoalsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" }
});

import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../../services/api";

export default function CreateHotelScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      await api.post("/hotels", { name, location });
      router.replace("/(admin)/hotels");
    } catch (error: any) {
      Alert.alert("Could not save hotel", error.response?.data?.message ?? "Please check the fields.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <TextInput onChangeText={setName} placeholder="Hotel name" style={styles.input} value={name} />
      <TextInput onChangeText={setLocation} placeholder="Location" style={styles.input} value={location} />
      <Pressable disabled={loading} onPress={save} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save hotel"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  input: { backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "900" }
});

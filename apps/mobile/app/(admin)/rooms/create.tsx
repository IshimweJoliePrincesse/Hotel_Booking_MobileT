import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../../services/api";

export default function CreateRoomScreen() {
  const { hotelId } = useLocalSearchParams<{ hotelId?: string }>();
  const [hotelIdValue, setHotelIdValue] = useState(hotelId ?? "");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  async function save() {
    try {
      await api.post("/rooms", {
        hotelId: Number(hotelIdValue),
        roomType,
        price: Number(price),
        isAvailable
      });
      router.replace(hotelIdValue ? `/(admin)/hotels/${hotelIdValue}/edit` : "/(admin)/hotels");
    } catch (error: any) {
      Alert.alert("Could not save room", error.response?.data?.message ?? "Please check the fields.");
    }
  }

  return (
    <View style={styles.screen}>
      <TextInput keyboardType="numeric" onChangeText={setHotelIdValue} placeholder="Hotel ID" style={styles.input} value={hotelIdValue} />
      <TextInput onChangeText={setRoomType} placeholder="Room type" style={styles.input} value={roomType} />
      <TextInput keyboardType="decimal-pad" onChangeText={setPrice} placeholder="Price" style={styles.input} value={price} />
      <Pressable onPress={() => setIsAvailable((value) => !value)} style={styles.toggle}>
        <Text style={styles.toggleText}>{isAvailable ? "Available" : "Unavailable"}</Text>
      </Pressable>
      <Pressable onPress={save} style={styles.button}><Text style={styles.buttonText}>Save room</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  input: { backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  toggle: { borderColor: "#0f766e", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  toggleText: { color: "#0f766e", fontWeight: "900", textAlign: "center" },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "900" }
});

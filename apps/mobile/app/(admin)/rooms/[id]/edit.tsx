import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api, Room } from "../../../../services/api";

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotelId, setHotelId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    api.get<Room>(`/rooms/${id}`).then(({ data }) => {
      setHotelId(String(data.hotel_id));
      setRoomType(data.room_type);
      setPrice(String(data.price));
      setIsAvailable(data.is_available === true || data.is_available === 1);
    });
  }, [id]);

  async function save() {
    await api.put(`/rooms/${id}`, {
      hotelId: Number(hotelId),
      roomType,
      price: Number(price),
      isAvailable
    });
    Alert.alert("Saved", "Room updated.");
  }

  async function remove() {
    await api.delete(`/rooms/${id}`);
    router.replace(`/(admin)/hotels/${hotelId}/edit`);
  }

  return (
    <View style={styles.screen}>
      <TextInput keyboardType="numeric" onChangeText={setHotelId} placeholder="Hotel ID" style={styles.input} value={hotelId} />
      <TextInput onChangeText={setRoomType} placeholder="Room type" style={styles.input} value={roomType} />
      <TextInput keyboardType="decimal-pad" onChangeText={setPrice} placeholder="Price" style={styles.input} value={price} />
      <Pressable onPress={() => setIsAvailable((value) => !value)} style={styles.toggle}>
        <Text style={styles.toggleText}>{isAvailable ? "Available" : "Unavailable"}</Text>
      </Pressable>
      <Pressable onPress={save} style={styles.button}><Text style={styles.buttonText}>Update room</Text></Pressable>
      <Pressable onPress={remove} style={styles.deleteButton}><Text style={styles.deleteText}>Delete room</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  input: { backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  toggle: { borderColor: "#0f766e", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  toggleText: { color: "#0f766e", fontWeight: "900", textAlign: "center" },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "900" },
  deleteButton: { alignItems: "center", borderColor: "#b91c1c", borderRadius: 8, borderWidth: 1, marginTop: 10, padding: 14 },
  deleteText: { color: "#b91c1c", fontWeight: "900" }
});

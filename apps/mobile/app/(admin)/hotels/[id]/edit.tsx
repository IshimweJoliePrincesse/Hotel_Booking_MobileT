import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api, Hotel, Room } from "../../../../services/api";

export default function EditHotelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    api.get<Hotel>(`/hotels/${id}`).then(({ data }) => {
      setHotel(data);
      setName(data.name);
      setLocation(data.location);
    });
  }, [id]);

  async function save() {
    await api.put(`/hotels/${id}`, { name, location });
    Alert.alert("Saved", "Hotel updated.");
  }

  async function remove() {
    await api.delete(`/hotels/${id}`);
    router.replace("/(admin)/hotels");
  }

  function renderRoom({ item }: { item: Room }) {
    return (
      <Link href={`/(admin)/rooms/${item.id}/edit`} style={styles.room}>
        {item.room_type} - R{item.price} - {item.is_available ? "Available" : "Unavailable"}
      </Link>
    );
  }

  return (
    <View style={styles.screen}>
      <TextInput onChangeText={setName} placeholder="Hotel name" style={styles.input} value={name} />
      <TextInput onChangeText={setLocation} placeholder="Location" style={styles.input} value={location} />
      <Pressable onPress={save} style={styles.button}><Text style={styles.buttonText}>Update hotel</Text></Pressable>
      <Pressable onPress={remove} style={styles.deleteButton}><Text style={styles.deleteText}>Delete hotel</Text></Pressable>
      <Link href={`/(admin)/rooms/create?hotelId=${id}`} style={styles.addRoom}>Add room</Link>
      <Text style={styles.section}>Rooms</Text>
      <FlatList
        data={hotel?.rooms ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRoom}
        ListEmptyComponent={<Text style={styles.empty}>No rooms yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  input: { backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 14 },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "900" },
  deleteButton: { alignItems: "center", borderColor: "#b91c1c", borderRadius: 8, borderWidth: 1, marginTop: 10, padding: 14 },
  deleteText: { color: "#b91c1c", fontWeight: "900" },
  addRoom: { color: "#0f766e", fontWeight: "900", marginTop: 18 },
  section: { color: "#0f172a", fontSize: 18, fontWeight: "900", marginBottom: 10, marginTop: 18 },
  room: { backgroundColor: "#ffffff", borderColor: "#d8dee4", borderRadius: 8, borderWidth: 1, color: "#0f172a", marginBottom: 10, overflow: "hidden", padding: 14 },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { RoomCard } from "../../../components/RoomCard";
import { useHotel } from "../../../hooks/useHotels";

export default function HotelDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hotel, loading } = useHotel(id);

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;
  if (!hotel) return <Text style={styles.empty}>Hotel not found.</Text>;

  return (
    <View style={styles.screen}>
      <Text style={styles.name}>{hotel.name}</Text>
      <Text style={styles.location}>{hotel.location}</Text>
      <Text style={styles.section}>Rooms</Text>
      <FlatList
        data={hotel.rooms ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RoomCard room={item} hotelId={hotel.id} />}
        ListEmptyComponent={<Text style={styles.empty}>No rooms listed for this hotel.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  name: { color: "#0f172a", fontSize: 28, fontWeight: "900" },
  location: { color: "#475569", marginTop: 6 },
  section: { color: "#0f172a", fontSize: 18, fontWeight: "900", marginBottom: 12, marginTop: 24 },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

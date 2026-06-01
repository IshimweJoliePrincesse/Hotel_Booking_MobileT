import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Hotel } from "../services/api";

export function HotelCard({ hotel, admin = false }: { hotel: Hotel; admin?: boolean }) {
  return (
    <Link href={admin ? `/(admin)/hotels/${hotel.id}/edit` : `/(customer)/hotels/${hotel.id}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        <Text style={styles.meta}>
          {hotel.room_count ?? hotel.rooms?.length ?? 0} rooms
          {hotel.lowest_price ? ` - from R${hotel.lowest_price}` : ""}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d8dee4",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16
  },
  name: { color: "#0f172a", fontSize: 18, fontWeight: "700" },
  location: { color: "#475569", marginTop: 4 },
  meta: { color: "#0f766e", fontWeight: "700", marginTop: 10 }
});

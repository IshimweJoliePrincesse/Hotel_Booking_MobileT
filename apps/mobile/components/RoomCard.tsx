import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Room } from "../services/api";

export function RoomCard({ room, hotelId }: { room: Room; hotelId: number }) {
  const available = room.is_available === true || room.is_available === 1;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.type}>{room.room_type}</Text>
        <Text style={styles.price}>R{room.price} per night</Text>
        <Text style={[styles.status, !available && styles.unavailable]}>
          {available ? "Available" : "Unavailable"}
        </Text>
      </View>
      {available ? (
        <Link
          href={`/(customer)/hotels/book?hotelId=${hotelId}&roomType=${encodeURIComponent(room.room_type)}`}
          style={styles.link}
        >
          Book
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d8dee4",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 14
  },
  type: { color: "#111827", fontSize: 16, fontWeight: "700" },
  price: { color: "#475569", marginTop: 4 },
  status: { color: "#15803d", marginTop: 6 },
  unavailable: { color: "#b91c1c" },
  link: {
    backgroundColor: "#0f766e",
    borderRadius: 8,
    color: "#ffffff",
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingVertical: 10
  }
});

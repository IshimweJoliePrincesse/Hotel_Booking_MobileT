import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Booking } from "../services/api";
import { formatDate } from "../utils/dateHelpers";

export function BookingItem({ booking }: { booking: Booking }) {
  return (
    <Link href={`/(customer)/bookings/${booking.id}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.hotel}>{booking.hotel_name}</Text>
        <Text style={styles.meta}>{booking.room_type}</Text>
        <Text style={styles.meta}>
          {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
        </Text>
        <Text style={[styles.status, booking.status === "cancelled" && styles.cancelled]}>
          {booking.status}
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
  hotel: { color: "#111827", fontSize: 17, fontWeight: "700" },
  meta: { color: "#475569", marginTop: 5 },
  status: { color: "#0f766e", fontWeight: "800", marginTop: 8, textTransform: "capitalize" },
  cancelled: { color: "#b91c1c" }
});

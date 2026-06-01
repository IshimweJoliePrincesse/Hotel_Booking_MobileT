import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAllBookings } from "../../../hooks/useBookings";
import { Booking } from "../../../services/api";
import { formatDate } from "../../../utils/dateHelpers";

function AdminBookingCard({ booking }: { booking: Booking }) {
  return (
    <View style={styles.card}>
      <Text style={styles.hotel}>{booking.hotel_name}</Text>
      <Text style={styles.line}>{booking.customer_name} - {booking.email}</Text>
      <Text style={styles.line}>{booking.room_type}</Text>
      <Text style={styles.line}>{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</Text>
      <Text style={styles.total}>R{booking.amount ?? "0.00"} - {booking.status}</Text>
    </View>
  );
}

export default function AdminBookingsScreen() {
  const { bookings, loading, refetch } = useAllBookings();

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={loading}
        renderItem={({ item }) => <AdminBookingCard booking={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  card: { backgroundColor: "#ffffff", borderColor: "#d8dee4", borderRadius: 8, borderWidth: 1, marginBottom: 12, padding: 16 },
  hotel: { color: "#0f172a", fontSize: 17, fontWeight: "900" },
  line: { color: "#475569", marginTop: 5 },
  total: { color: "#0f766e", fontWeight: "900", marginTop: 10, textTransform: "capitalize" },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

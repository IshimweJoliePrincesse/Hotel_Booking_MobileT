import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { BookingItem } from "../../../components/BookingItem";
import { useMyBookings } from "../../../hooks/useBookings";

export default function MyBookingsScreen() {
  const { bookings, loading, refetch } = useMyBookings();

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={loading}
        renderItem={({ item }) => <BookingItem booking={item} />}
        ListEmptyComponent={<Text style={styles.empty}>You have not made any bookings yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

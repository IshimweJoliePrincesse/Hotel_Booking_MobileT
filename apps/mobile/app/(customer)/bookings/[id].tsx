import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { BillSummary } from "../../../components/BillSummary";
import { api, Bill, Booking } from "../../../services/api";
import { formatDate } from "../../../utils/dateHelpers";

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bookingResponse, billResponse] = await Promise.all([
        api.get<Booking>(`/bookings/${id}`),
        api.get<Bill>(`/billings/${id}`)
      ]);
      setBooking(bookingResponse.data);
      setBill(billResponse.data);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [id]);

  async function cancel() {
    try {
      await api.delete(`/bookings/${id}`);
      Alert.alert("Cancelled", "Your booking has been cancelled.");
      router.replace("/(customer)/bookings");
    } catch (error: any) {
      Alert.alert("Could not cancel", error.response?.data?.message ?? "Please try again.");
    }
  }

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;
  if (!booking) return <Text style={styles.empty}>Booking not found.</Text>;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{booking.hotel_name}</Text>
      <Text style={styles.line}>{booking.room_type}</Text>
      <Text style={styles.line}>
        {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
      </Text>
      <Text style={styles.status}>{booking.status}</Text>
      {bill ? <BillSummary bill={bill} /> : null}
      {booking.status === "confirmed" ? (
        <Pressable onPress={cancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel booking</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  title: { color: "#0f172a", fontSize: 26, fontWeight: "900" },
  line: { color: "#475569", marginTop: 8 },
  status: { color: "#0f766e", fontWeight: "900", marginTop: 12, textTransform: "capitalize" },
  cancelButton: { alignItems: "center", borderColor: "#b91c1c", borderRadius: 8, borderWidth: 1, marginTop: 18, padding: 14 },
  cancelText: { color: "#b91c1c", fontWeight: "900" },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

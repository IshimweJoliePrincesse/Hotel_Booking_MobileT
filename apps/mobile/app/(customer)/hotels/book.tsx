import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { DateRangePicker } from "../../../components/DateRangePicker";
import { api } from "../../../services/api";
import { todayDateInput, tomorrowDateInput } from "../../../utils/dateHelpers";

export default function BookRoomScreen() {
  const { hotelId, roomType } = useLocalSearchParams<{ hotelId: string; roomType: string }>();
  const [checkIn, setCheckIn] = useState(todayDateInput());
  const [checkOut, setCheckOut] = useState(tomorrowDateInput());
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    try {
      const { data } = await api.post("/bookings", {
        hotelId: Number(hotelId),
        roomType,
        checkIn,
        checkOut
      });
      Alert.alert("Booking confirmed", "Your bill has been generated.");
      router.replace(`/(customer)/bookings/${data.id}`);
    } catch (error: any) {
      Alert.alert("Booking failed", error.response?.data?.message ?? "Try different dates.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Book {roomType}</Text>
      <DateRangePicker checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />
      <Pressable disabled={loading} onPress={handleBook} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Checking availability..." : "Confirm booking"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  title: { color: "#0f172a", fontSize: 24, fontWeight: "900", marginBottom: 18 },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, marginTop: 20, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "800" }
});

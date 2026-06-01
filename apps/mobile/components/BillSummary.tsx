import { StyleSheet, Text, View } from "react-native";
import { Bill } from "../services/api";
import { formatDate } from "../utils/dateHelpers";

export function BillSummary({ bill }: { bill: Bill }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bill Summary</Text>
      <Text style={styles.line}>Hotel: {bill.hotel_name}</Text>
      <Text style={styles.line}>Room: {bill.room_type}</Text>
      <Text style={styles.line}>
        Dates: {formatDate(bill.check_in)} - {formatDate(bill.check_out)}
      </Text>
      <Text style={styles.total}>Total: R{bill.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ecfeff",
    borderColor: "#67e8f9",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16
  },
  title: { color: "#0f172a", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  line: { color: "#334155", marginTop: 6 },
  total: { color: "#0f766e", fontSize: 20, fontWeight: "900", marginTop: 12 }
});

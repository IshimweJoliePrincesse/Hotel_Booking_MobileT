import { StyleSheet, Text, TextInput, View } from "react-native";

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange
}: {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.label}>Check-in</Text>
        <TextInput value={checkIn} onChangeText={onCheckInChange} placeholder="YYYY-MM-DD" style={styles.input} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Check-out</Text>
        <TextInput value={checkOut} onChangeText={onCheckOutChange} placeholder="YYYY-MM-DD" style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  label: { color: "#334155", fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  }
});

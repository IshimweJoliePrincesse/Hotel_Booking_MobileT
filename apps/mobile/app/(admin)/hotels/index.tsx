import { Link } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { HotelCard } from "../../../components/HotelCard";
import { useHotels } from "../../../hooks/useHotels";

export default function AdminHotelsScreen() {
  const { hotels, loading, refetch } = useHotels();

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;

  return (
    <View style={styles.screen}>
      <Link href="/(admin)/hotels/create" style={styles.addButton}>Add hotel</Link>
      <FlatList
        data={hotels}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={loading}
        renderItem={({ item }) => <HotelCard hotel={item} admin />}
        ListEmptyComponent={<Text style={styles.empty}>No hotels yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  addButton: {
    backgroundColor: "#0f766e",
    borderRadius: 8,
    color: "#ffffff",
    fontWeight: "900",
    marginBottom: 14,
    overflow: "hidden",
    padding: 14,
    textAlign: "center"
  },
  empty: { color: "#64748b", padding: 16, textAlign: "center" }
});

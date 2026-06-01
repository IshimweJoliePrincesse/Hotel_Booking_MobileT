import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { HotelCard } from "../../../components/HotelCard";
import { useHotels } from "../../../hooks/useHotels";

export default function HotelsScreen() {
  const { hotels, loading, refetch } = useHotels();

  if (loading) return <ActivityIndicator color="#0f766e" style={styles.loader} />;

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Browse hotels</Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => String(item.id)}
        onRefresh={refetch}
        refreshing={loading}
        renderItem={({ item }) => <HotelCard hotel={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No hotels available yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, padding: 16 },
  loader: { flex: 1 },
  heading: { color: "#0f172a", fontSize: 24, fontWeight: "900", marginBottom: 14 },
  empty: { color: "#64748b", textAlign: "center" }
});

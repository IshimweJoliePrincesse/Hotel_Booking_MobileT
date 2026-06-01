import { Link, Stack, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function CustomerLayout() {
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link href="/(customer)/hotels" style={styles.navLink}>Hotels</Link>
        <Link href="/(customer)/bookings" style={styles.navLink}>My Bookings</Link>
        <Pressable onPress={handleLogout}><Text style={styles.logout}>Logout</Text></Pressable>
      </View>
      <Stack screenOptions={{ headerTintColor: "#0f172a" }}>
        <Stack.Screen name="hotels/index" options={{ title: "Hotels" }} />
        <Stack.Screen name="hotels/[id]" options={{ title: "Hotel Details" }} />
        <Stack.Screen name="hotels/book" options={{ title: "Book Room" }} />
        <Stack.Screen name="bookings/index" options={{ title: "My Bookings" }} />
        <Stack.Screen name="bookings/[id]" options={{ title: "Booking Details" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { backgroundColor: "#ffffff", borderBottomColor: "#e2e8f0", borderBottomWidth: 1, flexDirection: "row", gap: 16, padding: 14 },
  navLink: { color: "#0f766e", fontWeight: "800" },
  logout: { color: "#b91c1c", fontWeight: "800" }
});

import { Link, Stack, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link href="/(admin)/hotels" style={styles.navLink}>Hotels</Link>
        <Link href="/(admin)/bookings" style={styles.navLink}>Bookings</Link>
        <Pressable onPress={handleLogout}><Text style={styles.logout}>Logout</Text></Pressable>
      </View>
      <Stack screenOptions={{ headerTintColor: "#0f172a" }}>
        <Stack.Screen name="hotels/index" options={{ title: "Manage Hotels" }} />
        <Stack.Screen name="hotels/create" options={{ title: "Add Hotel" }} />
        <Stack.Screen name="hotels/[id]/edit" options={{ title: "Edit Hotel" }} />
        <Stack.Screen name="rooms/create" options={{ title: "Add Room" }} />
        <Stack.Screen name="rooms/[id]/edit" options={{ title: "Edit Room" }} />
        <Stack.Screen name="bookings/index" options={{ title: "All Bookings" }} />
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

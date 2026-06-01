import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0f766e" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href={user.role === "admin" ? "/(admin)/hotels" : "/(customer)/hotels"} />;
}

const styles = StyleSheet.create({
  center: { alignItems: "center", flex: 1, justifyContent: "center" }
});

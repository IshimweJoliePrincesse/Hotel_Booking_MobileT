import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getApiErrorMessage } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  async function handleLogin() {
    setLoading(true);
    try {
      const user = await login(email, password);
      router.replace(user.role === "admin" ? "/(admin)/hotels" : "/(customer)/hotels");
    } catch (error) {
      Alert.alert("Login failed", getApiErrorMessage(error, "Check your email and password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hotel Booking</Text>
      <Text style={styles.subtitle}>Sign in to manage your stays.</Text>
      <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" style={styles.input} value={email} />
      <TextInput onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} value={password} />
      <Pressable disabled={loading} onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Login"}</Text>
      </Pressable>
      <Link href="/(auth)/register" style={styles.link}>
        Create an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, justifyContent: "center", padding: 24 },
  title: { color: "#0f172a", fontSize: 32, fontWeight: "900" },
  subtitle: { color: "#475569", marginBottom: 28, marginTop: 8 },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14
  },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, marginTop: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "800" },
  link: { color: "#0f766e", fontWeight: "700", marginTop: 18, textAlign: "center" }
});

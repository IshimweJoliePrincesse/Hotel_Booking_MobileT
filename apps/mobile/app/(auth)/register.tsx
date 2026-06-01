import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getApiErrorMessage, Role } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);

  async function handleRegister() {
    setLoading(true);
    try {
      const user = await register({ name, email, password, role });
      router.replace(user.role === "admin" ? "/(admin)/hotels" : "/(customer)/hotels");
    } catch (error) {
      Alert.alert("Registration failed", getApiErrorMessage(error, "Please check your details."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Create account</Text>
      <TextInput onChangeText={setName} placeholder="Full name" style={styles.input} value={name} />
      <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" style={styles.input} value={email} />
      <TextInput onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} value={password} />
      <View style={styles.roleRow}>
        {(["customer", "admin"] as Role[]).map((item) => (
          <Pressable key={item} onPress={() => setRole(item)} style={[styles.roleButton, role === item && styles.roleButtonActive]}>
            <Text style={[styles.roleText, role === item && styles.roleTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable disabled={loading} onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Register"}</Text>
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>
        I already have an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f8fafc", flex: 1, justifyContent: "center", padding: 24 },
  title: { color: "#0f172a", fontSize: 30, fontWeight: "900", marginBottom: 24 },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14
  },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  roleButton: { borderColor: "#cbd5e1", borderRadius: 8, borderWidth: 1, flex: 1, padding: 12 },
  roleButtonActive: { backgroundColor: "#0f766e", borderColor: "#0f766e" },
  roleText: { color: "#334155", fontWeight: "800", textAlign: "center", textTransform: "capitalize" },
  roleTextActive: { color: "#ffffff" },
  button: { alignItems: "center", backgroundColor: "#0f766e", borderRadius: 8, marginTop: 8, padding: 15 },
  buttonText: { color: "#ffffff", fontWeight: "800" },
  link: { color: "#0f766e", fontWeight: "700", marginTop: 18, textAlign: "center" }
});

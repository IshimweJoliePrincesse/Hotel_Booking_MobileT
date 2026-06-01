import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { api, Role, User } from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { name: string; email: string; password: string; role?: Role }) => Promise<User>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

async function persistSession(user: User, token: string) {
  await AsyncStorage.multiSet([
    ["user", JSON.stringify(user)],
    ["token", token]
  ]);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,
  login: async (email, password) => {
    const { data } = await api.post("/users/login", {
      email: email.trim().toLowerCase(),
      password
    });
    await persistSession(data.user, data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },
  register: async (input) => {
    const { data } = await api.post("/users/register", {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase()
    });
    await persistSession(data.user, data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },
  hydrate: async () => {
    const [[, userJson], [, token]] = await AsyncStorage.multiGet(["user", "token"]);
    set({
      user: userJson ? JSON.parse(userJson) : null,
      token,
      isHydrated: true
    });
  },
  logout: async () => {
    await AsyncStorage.multiRemove(["user", "token"]);
    set({ user: null, token: null });
  }
}));

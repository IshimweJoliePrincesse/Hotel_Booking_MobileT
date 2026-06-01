import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const constants = Constants as typeof Constants & {
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoGo?: { debuggerHost?: string }; expoClient?: { hostUri?: string } } };
  };
  const hostUri =
    constants.expoConfig?.hostUri ??
    constants.manifest2?.extra?.expoClient?.hostUri ??
    constants.manifest2?.extra?.expoGo?.debuggerHost ??
    constants.manifest?.debuggerHost;
  const host = hostUri?.replace(/^https?:\/\//, "").replace(/^exp:\/\//, "").split(":")[0];
  if (host) {
    return `http://${host}:5000/api`;
  }

  return Platform.OS === "android" ? "http://10.0.2.2:5000/api" : "http://localhost:5000/api";
}

export const API_BASE_URL = getApiBaseUrl();

export type Role = "admin" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  lowest_price?: string | null;
  room_count?: number;
  rooms?: Room[];
}

export interface Room {
  id: number;
  hotel_id: number;
  room_type: string;
  price: string;
  is_available: 0 | 1 | boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  status: "confirmed" | "cancelled";
  amount?: string;
  hotel_name: string;
  location?: string;
  room_type: string;
  price?: string;
  customer_name?: string;
  email?: string;
}

export interface Bill {
  id: number;
  booking_id: number;
  amount: string;
  generated_at: string;
  hotel_name: string;
  room_type: string;
  check_in: string;
  check_out: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    if (error.message === "Network Error") {
      return `Cannot reach the backend at ${API_BASE_URL}. Make sure the backend server is running.`;
    }

    if (error.code === "ECONNABORTED") {
      return "The backend took too long to respond. Please try again.";
    }
  }

  return fallback;
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const auth = useAuthStore();

  useEffect(() => {
    if (!auth.isHydrated) {
      auth.hydrate();
    }
  }, [auth]);

  return auth;
}

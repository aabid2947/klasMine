// store/useAuthStore.ts
import { create } from "zustand";

export interface User {
  user_id: string;
  sess_id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  need_setup?: string;
  billing_expired?: string;
  is_email_verified?: string;
  address?: {
    address_line_1?: string;
    city?: string;
    zip?: string;
    state_code?: string;
    country?: string;
  };
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setAuth: (user) => {
    // persist only essentials in localStorage
    localStorage.setItem("user_id", user.user_id);
    localStorage.setItem("session_id", user.sess_id);

    // store complete user in state
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("session_id");
    set({ user: null });
  },
}));

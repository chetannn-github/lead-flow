import { create } from "zustand";
import api from "../lib/api";
import { AUTH_BASE_URL } from "../config/env";

const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,

  authenticateUser: async ({ email, password }) => {
    try {
      set({ loading: true });

      const data = await api.post(AUTH_BASE_URL,"/auth/continue", {
        email,
        password,
      }, token);

      if (!data?.success) {
        throw new Error(data?.message || "Authentication failed");
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signInWithGoogle: async (googleToken) => {
    try {
      set({ loading: true });

      const data = await api.post(AUTH_BASE_URL,"/auth/google", {
        token: googleToken,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Google auth failed");
      }

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));
import { create } from "zustand";
import api from "../lib/api";
import { AUTH_BASE_URL } from "../config/env";

const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

export const useAuthStore = create((set) => ({
  user: null,
  token: token,
  loading: false,
  isAuthenticated: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      set({ isCheckingAuth : true });
      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });

        return;
      }

      const data = await api.get(
        AUTH_BASE_URL,
        "/me",
        token
      );

      if (!data?.success) {
        throw new Error("Unauthorized");
      }

      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  authenticateUser: async ({ email, password }) => {
    try {
      set({ loading: true });

      const data = await api.post(
        AUTH_BASE_URL,
        "/continue",
        {
          email,
          password,
        }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Authentication failed");
      }

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signInWithGoogle: async (googleToken) => {
    try {
      set({ loading: true });

      const data = await api.post(
        AUTH_BASE_URL,
        "/auth/google",
        {
          token: googleToken,
        }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Google auth failed");
      }

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

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
      isAuthenticated: false,
    });
  },
}));
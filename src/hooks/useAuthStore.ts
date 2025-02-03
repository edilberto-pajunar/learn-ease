import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client_app";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  initializeAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Default to logged out

  setIsAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },

  initializeAuthState: () => {
    onAuthStateChanged(auth, (user) => {
      set({ isAuthenticated: !!user });
    });
  },
}));

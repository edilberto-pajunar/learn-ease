"use client";

import { create } from "zustand";

interface SignupStore {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  error: null,
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: null,
    }),
}));

import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  authenticated: boolean;
  user: User | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  user: null,
}));

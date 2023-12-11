import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  authenticated: boolean;
  user: User | null;
}

interface AuthAction {
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  authenticated: false,
  user: null,
  login: (user) => set(() => ({ authenticated: true, user })),
  logout: () => set(() => ({ authenticated: false, user: null })),
}));

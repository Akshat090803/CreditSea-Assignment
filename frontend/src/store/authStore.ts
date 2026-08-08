import { create } from 'zustand';

interface AuthState {
  role: string | null;
  setAuth: (role: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setAuth: (role) => set({ role }),
  logout: () => set({ role: null }),
}));
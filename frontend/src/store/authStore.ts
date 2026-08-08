// import { create } from 'zustand';

// interface AuthState {
//   role: string | null;
//   setAuth: (role: string | null) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   role: null,
//   setAuth: (role) => set({ role }),
//   logout: () => set({ role: null }),
// }));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: string | null;
  role: string | null;
  setAuth: (user: string | null, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      setAuth: (user, role) => set({ user, role }),
      logout: () => set({ user: null, role: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
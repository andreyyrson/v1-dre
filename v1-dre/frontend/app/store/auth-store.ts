import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, TokenResponse } from '@/types'

interface AuthState {
  user: User | null
  tokens: TokenResponse | null
  setAuth: (user: User, tokens: TokenResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setAuth: (user, tokens) => set({ user, tokens }),
      logout: () => set({ user: null, tokens: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

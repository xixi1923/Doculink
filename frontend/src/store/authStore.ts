import { create } from 'zustand'

export interface AuthUser {
  id?: number | string
  name?: string
  email: string | null
  role?: string
  [key: string]: any
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    set({ user, token })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    set({ user: null, token: null })
  },
}))

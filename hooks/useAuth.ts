"use client"

import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  username: string | null
  isAdmin: boolean
  login: (username: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isLoggedIn: typeof window !== 'undefined' ? !!localStorage.getItem('userId') : false,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  isAdmin: typeof window !== 'undefined' ? localStorage.getItem('username') === 'admin' : false,
  login: (username: string) => set({ isLoggedIn: true, username, isAdmin: username === 'admin' }),
  logout: () => set({ isLoggedIn: false, username: null, isAdmin: false }),
})) 
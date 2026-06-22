'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_KEY = 'storyflow_auth'

function loadAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null }
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { token: null, user: null }
}

function saveAuth(token: string, user: User) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }))
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadAuth()
    if (saved.token) {
      setToken(saved.token)
      setUser(saved.user)
    }
  }, [])

  const login = (token: string, user: User) => {
    setToken(token)
    setUser(user)
    saveAuth(token, user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    clearAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

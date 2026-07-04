'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
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
const ACTIVITY_KEY = 'storyflow_last_activity'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const ACTIVITY_CHECK_INTERVAL_MS = 30 * 1000

function decodeToken(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded?.exp) return false
  return Date.now() >= decoded.exp * 1000
}

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
  localStorage.removeItem(ACTIVITY_KEY)
}

function getLastActivity(): number {
  try {
    const val = localStorage.getItem(ACTIVITY_KEY)
    return val ? parseInt(val, 10) : Date.now()
  } catch {
    return Date.now()
  }
}

function touchActivity() {
  try {
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()))
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const verifiedRef = useRef(false)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    clearAuth()
  }, [])

  useEffect(() => {
    const saved = loadAuth()

    if (!saved.token) {
      setReady(true)
      return
    }

    if (isTokenExpired(saved.token)) {
      clearAuth()
      setReady(true)
      return
    }

    setToken(saved.token)
    setUser(saved.user)

    fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${saved.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token')
        verifiedRef.current = true
        touchActivity()
      })
      .catch(() => {
        clearAuth()
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [logout])

  useEffect(() => {
    if (!token) return

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    const onActivity = () => touchActivity()
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))

    const interval = setInterval(() => {
      const elapsed = Date.now() - getLastActivity()
      if (elapsed > SESSION_TIMEOUT_MS) {
        logout()
      }
    }, ACTIVITY_CHECK_INTERVAL_MS)

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity))
      clearInterval(interval)
    }
  }, [token, logout])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    saveAuth(newToken, newUser)
    touchActivity()
  }

  if (!ready) return null

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

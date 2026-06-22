'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthForm() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'login' ? 'login' : 'signup'
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-8 w-full max-w-md">
        <div className="flex mb-8">
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              tab === 'signup'
                ? 'text-[#FF6719] border-[#FF6719]'
                : 'text-[#999999] dark:text-[#666666] border-transparent hover:text-[#0A0A0A] dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              tab === 'login'
                ? 'text-[#FF6719] border-[#FF6719]'
                : 'text-[#999999] dark:text-[#666666] border-transparent hover:text-[#0A0A0A] dark:hover:text-white'
            }`}
          >
            Login
          </button>
        </div>

        {tab === 'signup' ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'Field cannot be empty'
    if (!password.trim()) errors.password = 'Field cannot be empty'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Invalid credentials')
      }

      const data = await res.json()
      login(data.access_token, data.user)
      router.push('/library')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-[#555555] dark:text-[#A0A0A0] mt-1">
          Log in to access your stories
        </p>
      </div>

      {error && (
        <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-[#DC2626]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
              Enter Email
            </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined })) }}
            className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors"
            placeholder="you@example.com"
          />
          {fieldErrors.email && <p className="text-xs text-[#DC2626]">{fieldErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
              Enter Password
            </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })) }}
            className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors"
            placeholder="••••••••"
          />
          {fieldErrors.password && <p className="text-xs text-[#DC2626]">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  )
}

function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleNameBlur = () => {
    if (!name.trim()) {
      setFieldErrors((p) => ({ ...p, name: 'This field cannot be empty' }))
    }
  }

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (val.length === 0) {
      setFieldErrors((p) => ({ ...p, email: undefined }))
    } else if (!EMAIL_REGEX.test(val)) {
      setFieldErrors((p) => ({ ...p, email: 'Enter a valid email address' }))
    } else {
      setFieldErrors((p) => ({ ...p, email: undefined }))
    }
  }

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setFieldErrors((p) => ({ ...p, email: 'This field cannot be empty' }))
    }
  }

  const validate = () => {
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) errors.name = 'This field cannot be empty'
    if (!email.trim()) errors.email = 'This field cannot be empty'
    else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email address'
    if (!password.trim()) errors.password = 'Field cannot be empty'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Signup failed')
      }

      const data = await res.json()
      login(data.access_token, data.user)
      router.push('/library')
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">
          Create Your Account
        </h1>
        <p className="text-sm text-[#555555] dark:text-[#A0A0A0] mt-1">
          Save and access your stories anywhere
        </p>
      </div>

      {error && (
        <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-[#DC2626]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
              Enter Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })) }}
              onBlur={handleNameBlur}
              autoFocus
              className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors"
              placeholder="Your name"
          />
          {fieldErrors.name && <p className="text-xs text-[#DC2626]">{fieldErrors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
              Enter Email
            </label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors"
            placeholder="you@example.com"
          />
          {fieldErrors.email && <p className="text-xs text-[#DC2626]">{fieldErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
              Enter Password
            </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })) }}
            className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors"
            placeholder="Min. 8 characters"
          />
          {fieldErrors.password && <p className="text-xs text-[#DC2626]">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-sm text-[#A0A0A0]">Loading...</p></div>}>
      <AuthForm />
    </Suspense>
  )
}

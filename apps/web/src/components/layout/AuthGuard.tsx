'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth')
    } else {
      setChecked(true)
    }
  }, [isAuthenticated, router])

  if (!checked) return null

  return <>{children}</>
}

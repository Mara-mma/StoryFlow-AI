'use client'

import { useAuth } from '@/context/AuthContext'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <DashboardSidebar />}
      <div className={`flex-1 ${isAuthenticated ? 'md:ml-[260px] pt-14 md:pt-0' : ''}`}>
        {children}
      </div>
    </div>
  )
}

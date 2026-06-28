'use client'

import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 md:ml-[260px] pt-14 md:pt-0">
        {children}
      </div>
    </div>
  )
}

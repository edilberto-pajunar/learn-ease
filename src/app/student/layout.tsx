'use client'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/hooks/useAuthStore'
import { UserRole } from '@/interface/user'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.role !== UserRole.STUDENT) {
      redirect('/admin')
    }
  }, [user, isAuthenticated])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">{children}</main>
      </div>
    </div>
  )
}

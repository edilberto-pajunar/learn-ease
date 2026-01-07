'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'

const Navbar: React.FC = () => {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 shadow-sm z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-slate-900">T-BRITE</span>
              <span className="text-xs text-slate-600">Learning Platform</span>
            </div>
          </button>

          {user && (
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-slate-600 capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

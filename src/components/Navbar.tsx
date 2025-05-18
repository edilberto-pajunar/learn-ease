'use client'

import { auth } from '@/firebase/client_app'
import { useAuthStore } from '@/hooks/useAuthStore'
import { UserRole } from '@/interface/user'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [showDialog, setShowDialog] = useState(false)

  // Navigation Links based on user role
  const links =
    user?.role === UserRole.ADMIN
      ? [
          { href: '/admin/students', label: 'Students' },
          { href: '/admin/materials', label: 'Materials' },
          { href: '/admin/summary', label: 'Summary' },
        ]
      : [
          { href: '/student', label: 'Home' },
          { href: '/student/mode', label: 'Reading Test' },
          { href: '/student/dashboard', label: 'Progress Dashboard' },
        ]

  const handleLogout = async () => {
    try {
      await logout()
      setShowDialog(false)
      router.push('/login')
    } catch (error) {
      console.error('Error logging out: ', error)
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.push('/')}>
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="LearnEase Logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-bold text-gray-800">LearnEase</span>
          </div>
        </button>

        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => setShowDialog(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDialog(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

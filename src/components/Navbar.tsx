'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { UserRole } from '@/interface/user'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [showDialog, setShowDialog] = useState(false)

  // Navigation Links based on user role
  const links =
    user?.role === UserRole.ADMIN
      ? [
          { href: '/admin/students', label: 'Students', icon: '👥' },
          { href: '/admin/materials', label: 'Materials', icon: '📚' },
          { href: '/admin/summary', label: 'Summary', icon: '📊' },
          { href: '/admin/skills', label: 'Skills', icon: '🎯' },
        ]
      : [
          { href: '/student', label: 'Home', icon: '🏠' },
          { href: '/student/mode', label: 'Reading Test', icon: '📖' },
          { href: '/student/reading/score', label: 'Score', icon: '🏆' },
          {
            href: '/student/dashboard',
            label: 'Progress Dashboard',
            icon: '📈',
          },
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
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <button
            onClick={() => router.push('/')}
            className="group flex items-center space-x-3 transition-all duration-200 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 shadow-lg">
                <Image
                  src="/t-brite-logo.png"
                  alt="T-BRITE Logo"
                  width={28}
                  height={28}
                  className="filter brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-blue-600 bg-clip-text text-transparent">
                T-BRITE
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Learning Platform
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  {pathname === link.href && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-accent/50 rounded-lg border border-border/50">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role?.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={() => setShowDialog(true)}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md transform transition-all">
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Confirm Logout
                  </h3>
                  <p className="text-muted-foreground">
                    Are you sure you want to logout from your account?
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

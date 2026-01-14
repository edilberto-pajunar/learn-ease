'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { UserRole } from '@/interface/user'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Users,
  BarChart3,
  Target,
  Home,
  Trophy,
  TrendingUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpenText,
  BookCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const adminLinks = [
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/materials', label: 'Materials', icon: BookOpenText },
    { href: '/admin/summary', label: 'Summary', icon: BarChart3 },
    { href: '/admin/lessons', label: 'Lessons', icon: BookCheck },
    { href: '/admin/skills', label: 'Skills', icon: Target },
  ]

  const studentLinks = [
    { href: '/student', label: 'Home', icon: Home },
    { href: '/student/mode', label: 'Reading Test', icon: BookOpenText },
    { href: '/student/score', label: 'Score', icon: Trophy },
    { href: '/student/lessons', label: 'Lessons', icon: BookCheck },
    // { href: '/student/dashboard', label: 'Progress', icon: TrendingUp },
  ]

  const links = user?.role === UserRole.ADMIN ? adminLinks : studentLinks

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-background border shadow-md"
        size="icon"
        variant="outline"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-[calc(100vh)] bg-background border-r border-border z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Collapse Toggle (Desktop) */}
          <div className="hidden lg:flex justify-end p-2 border-b border-border">
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role?.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2">
              <ul className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`}
                        />
                        {!isCollapsed && (
                          <span className="text-sm font-medium truncate">
                            {link.label}
                          </span>
                        )}
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className={`w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 ${
                    isCollapsed ? 'px-2' : 'justify-start'
                  }`}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-2">Logout</span>}
                </Button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div
              className={`text-xs text-muted-foreground ${isCollapsed ? 'text-center' : ''}`}
            >
              {isCollapsed ? '©' : '© 2026 T-BRITE'}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

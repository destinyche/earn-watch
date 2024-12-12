"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Home, LayoutDashboard, PlayCircle, Wallet, User, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { theme } from '@/lib/theme'
import { useToast } from '../ui/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProgress } from "../ui/navigation-progress";

// Navigation items configuration with consistent icons
const publicNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'How It Works', href: '/how-it-works', icon: PlayCircle },
]

const privateNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Watch Ads', href: '/watch-ads', icon: PlayCircle },
  { name: 'Withdraw', href: '/withdraw', icon: Wallet },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: LayoutDashboard },
]

const protectedRoutes = ['/dashboard', '/watch-ads', '/withdraw']
const adminRoutes = ['/admin']

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn, username, isAdmin, logout } = useAuth()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current navigation items based on auth state
  const currentNavigation = isLoggedIn 
    ? isAdmin 
      ? [...adminNavigation]
      : [...privateNavigation]
    : [...publicNavigation]

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    logout() // Update auth state
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push('/login')
  }

  const handleNavigate = (href: string) => {
    if (protectedRoutes.includes(href) && !isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    if (adminRoutes.includes(href) && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      return
    }

    router.push(href)
  }

  // Don't render navigation until after client-side hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationProgress />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  EarnWatch
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {currentNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigate(item.href)
                  }}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary flex items-center gap-2 ${
                    pathname === item.href 
                      ? 'text-primary font-semibold' 
                      : 'text-muted hover:scale-105'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}

              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    {username}
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {currentNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigate(item.href)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-base font-medium ${
                      pathname === item.href ? 'text-primary' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {username}
                    </div>
                    <Button 
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full flex items-center gap-2 justify-center"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2 px-3 pt-2">
                    <Button asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About EarnWatch</h3>
              <p className="text-gray-600">
                Watch ads and earn money with our innovative platform. 
                Join thousands of users who are already earning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/how-it-works" className="text-gray-600 hover:text-primary">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-600 hover:text-primary">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-600">
                Email: support@earnwatch.com<br />
                Phone: +237 xxx xxx xxx
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} EarnWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
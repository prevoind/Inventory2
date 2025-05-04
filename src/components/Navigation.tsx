// Create this file at src/components/Navigation.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Home Inventory
            </Link>
            
            <div className="hidden sm:flex sm:space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              
              <Link
                href="/search"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/search'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
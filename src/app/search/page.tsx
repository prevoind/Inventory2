// Create this file at src/app/search/page.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Search } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface SearchResult {
  id: string
  name: string
  description?: string
  category?: string
  brand?: string
  model_number?: string
  serial_number?: string
  purchase_date?: string
  purchase_price?: number
  current_value?: number
  condition?: string
  notes?: string
  image_urls?: string[]
  property_name: string
  room_name?: string
  property_id: string
  room_id?: string
  created_at: string
  updated_at: string
  created_by?: string
}

export default function SearchPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await supabase
        .rpc('search_items', { search_term: searchTerm })

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Error searching items:', error)
      alert('Error searching items')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to search your inventory</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Your Inventory</h1>
          
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, description, category, brand, serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="bg-white shadow rounded-lg p-6">
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items found matching your search.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Found {results.length} item(s)</p>
                
                {results.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        
                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                          <p>Property: <span className="font-medium">{item.property_name}</span></p>
                          {item.room_name && (
                            <p>Room: <span className="font-medium">{item.room_name}</span></p>
                          )}
                          {item.category && (
                            <p>Category: <span className="font-medium">{item.category}</span></p>
                          )}
                          {item.brand && (
                            <p>Brand: <span className="font-medium">{item.brand}</span></p>
                          )}
                          {item.model_number && (
                            <p>Model: <span className="font-medium">{item.model_number}</span></p>
                          )}
                          {item.serial_number && (
                            <p>Serial: <span className="font-medium">{item.serial_number}</span></p>
                          )}
                          {item.condition && (
                            <p>Condition: <span className="font-medium">{item.condition}</span></p>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                        )}
                      </div>
                      
                      {item.current_value && (
                        <div className="ml-4">
                          <p className="text-lg font-semibold text-green-600">
                            ${item.current_value.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Current Value</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
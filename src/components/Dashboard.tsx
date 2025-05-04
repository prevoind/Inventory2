'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { House, Item, Room } from '@/types/database'
import HouseList from './HouseList'
import RoomList from './RoomList'
import ItemList from './ItemList'
import Navigation from './Navigation'

export default function Dashboard() {
  const { user } = useAuth()
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'items' | 'rooms'>('items')

  useEffect(() => {
    fetchHouses()
  }, [])

  useEffect(() => {
    if (selectedHouse) {
      fetchRooms(selectedHouse)
      fetchItems(selectedHouse)
    } else {
      // Clear data when no house is selected
      setRooms([])
      setItems([])
    }
  }, [selectedHouse])

  const fetchHouses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')  // Still 'properties' in the database
        .select('*')
        .order('name')
      
      if (error) throw error
      
      // Ensure data is an array
      const housesData = Array.isArray(data) ? data : []
      setHouses(housesData)
      
      if (housesData.length > 0 && !selectedHouse) {
        setSelectedHouse(housesData[0].id)
      }
    } catch (error) {
      console.error('Error fetching houses:', error)
      setHouses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async (houseId: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('property_id', houseId)  // Still 'property_id' in the database
        .order('name')
      
      if (error) throw error
      
      // Ensure data is an array
      const roomsData = Array.isArray(data) ? data : []
      setRooms(roomsData)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    }
  }

  const fetchItems = async (houseId: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          rooms (
            name
          )
        `)
        .eq('property_id', houseId)  // Still 'property_id' in the database
        .order('name')
      
      if (error) throw error
      
      // Ensure data is an array
      const itemsData = Array.isArray(data) ? data : []
      setItems(itemsData)
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <HouseList
              houses={houses}
              selectedHouse={selectedHouse}
              onSelectHouse={setSelectedHouse}
              onHousesChange={fetchHouses}
            />
          </div>
          <div className="md:col-span-2">
            {selectedHouse ? (
              <>
                <div className="mb-4">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab('items')}
                        className={`${
                          activeTab === 'items'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        Items
                      </button>
                      <button
                        onClick={() => setActiveTab('rooms')}
                        className={`${
                          activeTab === 'rooms'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        Rooms
                      </button>
                    </nav>
                  </div>
                </div>

                {activeTab === 'items' ? (
                  <ItemList
                    propertyId={selectedHouse}  // Still using propertyId prop name for now
                    items={items || []}
                    onItemsChange={() => fetchItems(selectedHouse)}
                  />
                ) : (
                  <RoomList
                    propertyId={selectedHouse}  // Still using propertyId prop name for now
                    rooms={rooms || []}
                    onRoomsChange={() => fetchRooms(selectedHouse)}
                  />
                )}
              </>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                Select a house to view its items and rooms
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
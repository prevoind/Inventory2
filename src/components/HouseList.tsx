'use client'

import { useState } from 'react'
import { House } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HouseListProps {
  houses: House[]
  selectedHouse: string | null
  onSelectHouse: (id: string) => void
  onHousesChange: () => void
}

export default function HouseList({
  houses,
  selectedHouse,
  onSelectHouse,
  onHousesChange,
}: HouseListProps) {
  const { user } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      console.log('Attempting to save house:', formData)
      console.log('Current user:', user?.id)
      
      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', editingId)
        
        if (error) {
          console.error('Update error:', error)
          throw error
        }
        setEditingId(null)
      } else {
        // Include user_id when inserting
        const dataToInsert = {
          ...formData,
          user_id: user?.id,
        }
        
        console.log('Data to insert:', dataToInsert)
        
        const { data, error } = await supabase
          .from('properties')
          .insert([dataToInsert])
          .select()
        
        if (error) {
          console.error('Insert error:', error)
          throw error
        }
        
        console.log('Insert successful:', data)
        setIsAdding(false)
      }
      
      setFormData({ name: '', address: '', description: '' })
      onHousesChange()
    } catch (error: any) {
      console.error('Error saving house:', error)
      setError(error.message || 'Error saving house')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this house?')) return
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      if (selectedHouse === id) {
        onSelectHouse(houses[0]?.id || null)
      }
      onHousesChange()
    } catch (error: any) {
      console.error('Error deleting house:', error)
      setError(error.message || 'Error deleting house')
    }
  }

  const startEdit = (house: House) => {
    setEditingId(house.id)
    setFormData({
      name: house.name,
      address: house.address || '',
      description: house.description || '',
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Houses</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="House Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setFormData({ name: '', address: '', description: '' })
                setError(null)
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {houses.length === 0 && (
          <p className="text-gray-500 text-center py-4">No houses yet. Click the + button to add one.</p>
        )}
        {houses.map((house) => (
          <div
            key={house.id}
            className={`p-3 border rounded cursor-pointer ${
              selectedHouse === house.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectHouse(house.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{house.name}</h3>
                {house.address && (
                  <p className="text-sm text-gray-600">{house.address}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    startEdit(house)
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(house.id)
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
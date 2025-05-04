'use client'

import { useState } from 'react'
import { Room } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface RoomListProps {
  propertyId: string
  rooms: Room[]
  onRoomsChange: () => void
}

export default function RoomList({
  propertyId,
  rooms,
  onRoomsChange,
}: RoomListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    floor: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const roomData = {
        ...formData,
        property_id: propertyId,
      }

      if (editingId) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingId)
        
        if (error) throw error
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([roomData])
        
        if (error) throw error
        setIsAdding(false)
      }
      
      setFormData({ name: '', description: '', floor: '' })
      onRoomsChange()
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Error saving room')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room? Items in this room will remain but will no longer be associated with a room.')) return
    
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      onRoomsChange()
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Error deleting room')
    }
  }

  const startEdit = (room: Room) => {
    setEditingId(room.id)
    setFormData({
      name: room.name,
      description: room.description || '',
      floor: room.floor || '',
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="Room Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Floor (e.g., Ground, 1st, 2nd)"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Room
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setFormData({ name: '', description: '', floor: '' })
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {rooms.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No rooms added yet</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="p-3 border rounded border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{room.name}</h3>
                  {room.floor && (
                    <p className="text-sm text-gray-600">Floor: {room.floor}</p>
                  )}
                  {room.description && (
                    <p className="text-sm text-gray-600">{room.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(room)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
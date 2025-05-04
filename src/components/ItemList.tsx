'use client'

import { useState, useEffect } from 'react'
import { Item, Room } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

interface ItemListProps {
  propertyId: string
  items?: Item[] | null
  onItemsChange: () => void
}

export default function ItemList({
  propertyId,
  items = [],
  onItemsChange,
}: ItemListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    model_number: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    current_value: '',
    condition: '',
    room_id: '',
    notes: '',
  })

  useEffect(() => {
    if (propertyId) {
      fetchRooms()
    }
  }, [propertyId])

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('property_id', propertyId)
        .order('name')
      
      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const itemData = {
        ...formData,
        property_id: propertyId,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        room_id: formData.room_id || null,
      }

      if (editingId) {
        const { error } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editingId)
        
        if (error) throw error
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('items')
          .insert([itemData])
        
        if (error) throw error
        setIsAdding(false)
      }
      
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        model_number: '',
        serial_number: '',
        purchase_date: '',
        purchase_price: '',
        current_value: '',
        condition: '',
        room_id: '',
        notes: '',
      })
      onItemsChange()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      onItemsChange()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    }
  }

  const startEdit = (item: Item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      brand: item.brand || '',
      model_number: item.model_number || '',
      serial_number: item.serial_number || '',
      purchase_date: item.purchase_date || '',
      purchase_price: item.purchase_price?.toString() || '',
      current_value: item.current_value?.toString() || '',
      condition: item.condition || '',
      room_id: item.room_id || '',
      notes: item.notes || '',
    })
  }

  // Defensive filtering
  let filteredItems: Item[] = []
  
  try {
    const itemsArray = Array.isArray(items) ? items : []
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filteredItems = itemsArray.filter(item => {
        if (!item) return false
        return (
          (item.name?.toLowerCase().includes(searchLower)) ||
          (item.description?.toLowerCase().includes(searchLower)) ||
          (item.category?.toLowerCase().includes(searchLower)) ||
          (item.brand?.toLowerCase().includes(searchLower))
        )
      })
    } else {
      filteredItems = itemsArray
    }
  } catch (error) {
    console.error('Error filtering items:', error)
    filteredItems = []
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Item Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
            <select
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Model Number"
              value={formData.model_number}
              onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Serial Number"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Purchase Date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Current Value"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              step="0.01"
            />
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={2}
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-2 border rounded text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Item
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  brand: '',
                  model_number: '',
                  serial_number: '',
                  purchase_date: '',
                  purchase_price: '',
                  current_value: '',
                  condition: '',
                  room_id: '',
                  notes: '',
                })
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items found</p>
        ) : (
          filteredItems.map((item) => {
            if (!item) return null
            return (
              <div
                key={item.id}
                className="p-3 border rounded border-gray-200 hover:border-blue-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                    )}
                    {item.brand && (
                      <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                    )}
                    {item.current_value && (
                      <p className="text-sm text-gray-600">
                        Value: ${item.current_value.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
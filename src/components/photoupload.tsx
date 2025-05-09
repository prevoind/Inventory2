'use client'

import { useState } from 'react'
import { BUCKET_NAME, ensureBucket } from '@/lib/minio'
import { Upload, X } from 'lucide-react'

interface PhotoUploadProps {
  itemId: string
  onPhotoUploaded: (url: string) => void
  maxPhotos?: number
  currentPhotos?: string[]
}

export default function PhotoUpload({ 
  itemId, 
  onPhotoUploaded, 
  maxPhotos = 4,
  currentPhotos = []
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (currentPhotos.length >= maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Ensure bucket exists
      await ensureBucket()

      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `items/${itemId}/${timestamp}-${file.name}`

      // Get presigned URL from API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          contentType: file.type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { presignedUrl } = await response.json()

      // Upload directly to MinIO using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      // Generate public URL
      const useSSL = process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true'
      const protocol = useSSL ? 'https' : 'http'
      const url = `${protocol}://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/${BUCKET_NAME}/${fileName}`
      
      onPhotoUploaded(url)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || currentPhotos.length >= maxPhotos}
            className="hidden"
          />
        </label>
        
        <span className="text-sm text-gray-600">
          {currentPhotos.length}/{maxPhotos} photos
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
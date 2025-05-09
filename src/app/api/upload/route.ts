import { NextResponse } from 'next/server'
import { minioClient, BUCKET_NAME } from '@/lib/minio'

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json()

    // Generate presigned URL
    const presignedUrl = await minioClient.presignedPutObject(
      BUCKET_NAME,
      fileName,
      60 * 5 // 5 minutes expiry
    )

    return NextResponse.json({ presignedUrl })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
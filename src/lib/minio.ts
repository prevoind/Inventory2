import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT!,
  port: parseInt(process.env.NEXT_PUBLIC_MINIO_PORT || '9000'),
  useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true',
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY!,
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRET_KEY!,
})

export const BUCKET_NAME = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || 'home-inventory'

// Ensure bucket exists
export async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      
      // Set bucket policy to allow public read (optional)
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      }
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
    }
  } catch (error) {
    console.error('Error ensuring bucket:', error)
  }
}
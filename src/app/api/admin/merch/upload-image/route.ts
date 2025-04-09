import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { adminStorage } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

export async function POST(req: NextRequest) {
  // Verify admin token
  const user = await verifyAdminToken(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const data = await req.formData()
  const file = data.get('file') as File

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 })
  }

  try {
    const bucket = adminStorage.bucket()
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `merch/${uuidv4()}-${file.name}`
    const fileRef = bucket.file(filename)

    await fileRef.save(buffer, {
      contentType: file.type,
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

    return Response.json({ url: publicUrl })
  } catch (err) {
    console.error('Merch upload error:', err)
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), { status: 500 })
  }
}

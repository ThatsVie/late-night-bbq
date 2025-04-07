import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { adminStorage } from '@/firebase/admin'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 })
  }

  try {
    const bucket = adminStorage.bucket()
    const buffer = Buffer.from(await file.arrayBuffer())

    const filename = `menu/${uuidv4()}-${file.name}`
    const fileRef = bucket.file(filename)

    await fileRef.save(buffer, {
      contentType: file.type,
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

    return Response.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), { status: 500 })
  }
}
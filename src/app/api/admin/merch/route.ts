import { NextRequest } from 'next/server'
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

export async function POST(req: NextRequest) {
  const user = await verifyAdminToken(req)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const data = await req.json()

    if (
      !data.en?.title || !data.en?.description ||
      !data.es?.title || !data.es?.description ||
      !Array.isArray(data.images) ||
      !data.activeImage ||
      typeof data.order !== 'number'
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    await adminDb.collection('merchItems').add(data)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error adding merch item:', error)
    return new Response(JSON.stringify({ error: 'Failed to add merch item' }), { status: 500 })
  }
}

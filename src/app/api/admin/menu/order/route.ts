import { NextRequest } from 'next/server'
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

export async function POST(req: NextRequest) {
  const user = await verifyAdminToken(req)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const items = await req.json()

    if (!Array.isArray(items) || items.some(item => !item.id || typeof item.order !== 'number')) {
      return new Response(JSON.stringify({ error: 'Invalid payload format' }), { status: 400 })
    }

    const batch = adminDb.batch()

    items.forEach((item: { id: string; order: number }) => {
      const ref = adminDb.collection('menuItems').doc(item.id)
      batch.update(ref, { order: item.order })
    })

    await batch.commit()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating menu order:', error)
    return new Response(JSON.stringify({ error: 'Failed to update menu order' }), { status: 500 })
  }
}

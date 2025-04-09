import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await verifyAdminToken(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await req.json()

    if (!Array.isArray(items) || items.some(item => !item.id || typeof item.order !== 'number')) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
    }

    const batch = adminDb.batch()
    items.forEach(({ id, order }: { id: string; order: number }) => {
      const ref = adminDb.collection('merchItems').doc(id)
      batch.update(ref, { order })
    })

    await batch.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating merch order:', error)
    return NextResponse.json({ error: 'Failed to update merch order' }, { status: 500 })
  }
}

import { db } from '@/firebase/config'
import { doc, writeBatch } from 'firebase/firestore'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const items = await req.json() // expecting an array of { id, order }

  const batch = writeBatch(db)
  items.forEach((item: { id: string; order: number }) => {
    const ref = doc(db, 'menuItems', item.id)
    batch.update(ref, { order: item.order })
  })

  await batch.commit()
  return Response.json({ success: true })
}

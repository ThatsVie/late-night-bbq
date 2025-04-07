import { NextRequest } from 'next/server'
import { db } from '@/firebase/config'
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore'

export async function GET() {
  const snapshot = await getDocs(query(collection(db, 'menuItems'), orderBy('order')))
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return Response.json(items)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await addDoc(collection(db, 'menuItems'), body)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error adding menu item:', error)
    return new Response('Failed to add item', { status: 500 })
  }
}

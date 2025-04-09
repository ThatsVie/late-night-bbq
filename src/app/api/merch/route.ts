import { db } from '@/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const snapshot = await getDocs(query(collection(db, 'merchItems'), orderBy('order')))
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return Response.json(items)
  } catch (error) {
    console.error('Error fetching merch items:', error)
    return new Response('Failed to fetch merch items', { status: 500 })
  }
}

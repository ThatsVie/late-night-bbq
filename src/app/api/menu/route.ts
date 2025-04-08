import { db } from '@/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

export async function GET() {
  const snapshot = await getDocs(query(collection(db, 'menuItems'), orderBy('order')))
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return Response.json(items)
}

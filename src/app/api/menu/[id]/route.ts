import { db } from '@/firebase/config'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  await updateDoc(doc(db, 'menuItems', params.id), data)
  return Response.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deleteDoc(doc(db, 'menuItems', params.id))
  return Response.json({ success: true })
}

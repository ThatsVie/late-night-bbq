import { db } from '@/firebase/config'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop()
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
  }

  const data = await req.json()
  await updateDoc(doc(db, 'menuItems', id), data)
  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop()
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
  }

  await deleteDoc(doc(db, 'menuItems', id))
  return Response.json({ success: true })
}

import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextRequest } from 'next/server'

// Create a new banner document
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = params.id
  const data = await req.json()

  try {
    await adminDb.doc(`banners/${id}`).set(data)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error creating banner:', error)
    return new Response(JSON.stringify({ error: 'Failed to create banner' }), { status: 500 })
  }
}

// Update an existing banner document
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = params.id
  const data = await req.json()

  const updates: Record<string, string> = {}

  if (data.en?.subtitle) updates['en.subtitle'] = data.en.subtitle
  if (data.en?.altText) updates['en.altText'] = data.en.altText
  if (data.es?.subtitle) updates['es.subtitle'] = data.es.subtitle
  if (data.es?.altText) updates['es.altText'] = data.es.altText
  if (data.shape) updates['shape'] = data.shape

  try {
    await adminDb.doc(`banners/${id}`).update(updates)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating banner:', error)
    return new Response(JSON.stringify({ error: 'Failed to update banner' }), { status: 500 })
  }
}

// Delete a banner document
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = params.id

  try {
    await adminDb.doc(`banners/${id}`).delete()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete banner' }), { status: 500 })
  }
}

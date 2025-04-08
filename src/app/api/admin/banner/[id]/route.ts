import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextRequest } from 'next/server'

// Utility to extract ID from the URL
function extractIdFromUrl(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.length - 2]
}

// Create a new banner document
export async function POST(req: NextRequest) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = extractIdFromUrl(req)
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
export async function PATCH(req: NextRequest) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = extractIdFromUrl(req)
  const data = await req.json()

  const updates: Record<string, string> = {}

  if (data.en?.subtitle) updates['en.subtitle'] = data.en.subtitle
  if (data.en?.altText) updates['en.altText'] = data.en.altText
  if (data.es?.subtitle) updates['es.subtitle'] = data.es.subtitle
  if (data.es?.altText) updates['es.altText'] = data.es.altText
  if (data.shape) updates['shape'] = data.shape

  // Prevent calling update() with empty object
  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: 'No valid fields to update' }), { status: 400 })
  }

  try {
    await adminDb.doc(`banners/${id}`).update(updates)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating banner:', error)
    return new Response(JSON.stringify({ error: 'Failed to update banner' }), { status: 500 })
  }
}

// Delete a banner document
export async function DELETE(req: NextRequest) {
  const decodedToken = await verifyAdminToken(req)
  if (!decodedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = extractIdFromUrl(req)

  try {
    await adminDb.doc(`banners/${id}`).delete()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete banner' }), { status: 500 })
  }
}

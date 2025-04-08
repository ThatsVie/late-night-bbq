import { NextRequest } from 'next/server'
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

// Utility to extract ID from dynamic route
function extractIdFromUrl(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.length - 1] || null
}

// PATCH: Update menu item
export async function PATCH(req: NextRequest) {
  const user = await verifyAdminToken(req)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = extractIdFromUrl(req)
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
  }

  try {
    const data = await req.json()

    if (!data || typeof data !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
    }

    await adminDb.collection('menuItems').doc(id).update(data)
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return new Response(JSON.stringify({ error: 'Failed to update menu item' }), { status: 500 })
  }
}

// DELETE: Remove menu item
export async function DELETE(req: NextRequest) {
  const user = await verifyAdminToken(req)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const id = extractIdFromUrl(req)
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
  }

  try {
    await adminDb.collection('menuItems').doc(id).delete()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete menu item' }), { status: 500 })
  }
}

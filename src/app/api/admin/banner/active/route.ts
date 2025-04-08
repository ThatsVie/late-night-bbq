import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  const user = await verifyAdminToken(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { id } = await req.json()

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid or missing banner ID' }), { status: 400 })
    }

    await adminDb.doc('homepage/settings').update({ activeBanner: id })

    return Response.json({ success: true, activeBanner: id })
  } catch (err) {
    console.error('Error updating active banner:', err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ error: 'Failed to update active banner' }), { status: 500 })
  }
}

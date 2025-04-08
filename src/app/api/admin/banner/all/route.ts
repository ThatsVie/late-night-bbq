import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const user = await verifyAdminToken(req)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const snapshot = await adminDb.collection('banners').get()

    const banners = snapshot.docs.map((doc) => {
      const data = doc.data()
      const enImageUrl = data?.en?.imageUrl || ''
      const isStorageBased =
        enImageUrl.startsWith('https://firebasestorage.googleapis.com') ||
        enImageUrl.startsWith('https://storage.googleapis.com')

      return {
        id: doc.id,
        imageUrl: enImageUrl,
        en: {
          subtitle: data?.en?.subtitle || '',
          altText: data?.en?.altText || '',
        },
        es: {
          subtitle: data?.es?.subtitle || '',
          altText: data?.es?.altText || '',
        },
        shape: data?.shape || 'square',
        isStorageBased,
      }
    })

    return Response.json(banners)
  } catch (err) {
    console.error('Error fetching all banners:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch banners' }), { status: 500 })
  }
}

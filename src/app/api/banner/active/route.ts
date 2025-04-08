import { adminDb } from '@/firebase/admin'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const locale = (url.searchParams.get('locale') || 'en') as 'en' | 'es'

    const settingsSnap = await adminDb.doc('homepage/settings').get()
    if (!settingsSnap.exists) return Response.json(null)

    const activeBannerId = settingsSnap.data()?.activeBanner
    if (!activeBannerId) return Response.json(null)

    const bannerSnap = await adminDb.doc(`banners/${activeBannerId}`).get()
    if (!bannerSnap.exists) return Response.json(null)

    const bannerData = bannerSnap.data()

    return Response.json({
      id: activeBannerId,
      imageUrl: bannerData?.[locale]?.imageUrl || '',
      subtitle: bannerData?.[locale]?.subtitle || '',
      altText: bannerData?.[locale]?.altText || '',
      shape: bannerData?.shape || 'square',
    })
  } catch (err) {
    console.error('Error fetching active banner:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch banner' }), { status: 500 })
  }
}

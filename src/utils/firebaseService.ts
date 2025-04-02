import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export async function fetchHomepageBanner(locale: 'en' | 'es') {
  const settingsRef = doc(db, 'homepage', 'settings')
  const settingsSnap = await getDoc(settingsRef)

  const activeBannerId = settingsSnap.exists() ? settingsSnap.data().activeBanner : null
  if (!activeBannerId) return null

  const bannerRef = doc(db, 'banners', activeBannerId)
  const bannerSnap = await getDoc(bannerRef)

  if (!bannerSnap.exists()) return null

  const data = bannerSnap.data()

  return {
    imageUrl: data[locale]?.imageUrl || '',
    subtitle: data[locale]?.subtitle || '',
    altText: data[locale]?.altText || '',
    shape: data.shape || 'square', // fallback
  }
}

export async function updateBannerContent(
  bannerId: string,
  updatedFields: Partial<{ subtitle: string; altText: string; shape: 'square' | 'rect' }>
) {
  const updates: Record<string, string> = {}

  if ('subtitle' in updatedFields) {
    updates['en.subtitle'] = updatedFields.subtitle || ''
    updates['es.subtitle'] = updatedFields.subtitle || ''
  }

  if ('altText' in updatedFields) {
    updates['en.altText'] = updatedFields.altText || ''
    updates['es.altText'] = updatedFields.altText || ''
  }

  if ('shape' in updatedFields && updatedFields.shape) {
    updates['shape'] = updatedFields.shape
  }

  await updateDoc(doc(db, 'banners', bannerId), updates)
}

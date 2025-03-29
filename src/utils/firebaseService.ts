import { doc, getDoc } from 'firebase/firestore'
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
  return data[locale]
}

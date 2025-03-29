'use client'

import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore'

export default function EditBannerPage() {
  const [banners, setBanners] = useState<string[]>([])
  const [activeBanner, setActiveBanner] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const bannersSnap = await getDocs(collection(db, 'banners'))
      const allBanners = bannersSnap.docs.map((doc) => doc.id)
      setBanners(allBanners)

      const settingsSnap = await getDoc(doc(db, 'homepage', 'settings'))
      setActiveBanner(settingsSnap.data()?.activeBanner || '')
    }

    fetchData()
  }, [])

  const handleBannerChange = async (newBanner: string) => {
    await updateDoc(doc(db, 'homepage', 'settings'), {
      activeBanner: newBanner,
    })
    setActiveBanner(newBanner)
  }

  return (
    <main className="p-6 text-white bg-zinc-950 min-h-screen">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Select Active Homepage Banner</h1>
      <ul className="space-y-4">
        {banners.map((bannerId) => (
          <li
            key={bannerId}
            className="flex items-center justify-between bg-black p-4 rounded-lg border border-white/10"
          >
            <span>{bannerId}</span>
            <button
              onClick={() => handleBannerChange(bannerId)}
              className={`px-4 py-2 rounded font-bold ${
                activeBanner === bannerId
                  ? 'bg-pink-500 text-black'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {activeBanner === bannerId ? 'Active' : 'Set Active'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

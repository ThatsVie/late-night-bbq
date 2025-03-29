'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/firebase/config'
import { doc, updateDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'

interface Banner {
  id: string
  isStorageBased: boolean
}

export default function EditBannerPage() {
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [activeBanner, setActiveBanner] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const bannersSnap = await getDocs(collection(db, 'banners'))
      const bannersData: Banner[] = bannersSnap.docs.map((doc) => {
        const data = doc.data()
        const enImageUrl = data?.en?.imageUrl || ''
        const isStorageBased = enImageUrl.startsWith('https://firebasestorage.googleapis.com')
        return {
          id: doc.id,
          isStorageBased,
        }
      })
      setBanners(bannersData)

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

  const handleDeleteBanner = async (bannerId: string) => {
    const confirmed = window.confirm(`Delete banner "${bannerId}"? This cannot be undone.`)
    if (!confirmed) return

    await deleteDoc(doc(db, 'banners', bannerId))
    setBanners((prev) => prev.filter((b) => b.id !== bannerId))

    if (activeBanner === bannerId) {
      await updateDoc(doc(db, 'homepage', 'settings'), {
        activeBanner: '',
      })
      setActiveBanner('')
    }
  }

  return (
    <main className="p-6 text-white bg-zinc-950 min-h-screen">
      <button
        onClick={() => router.push('/admin/banner/upload')}
        className="mb-6 bg-pink-600 hover:bg-pink-700 text-black px-4 py-2 rounded font-bold"
      >
        + Upload New Banner
      </button>

      <h1 className="text-2xl font-bold text-pink-500 mb-6">Select Active Homepage Banner</h1>

      <button
        onClick={() => router.push('/admin')}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Admin Dashboard
      </button>

      <ul className="space-y-4">
        {banners.map((banner) => (
          <li
            key={banner.id}
            className="flex items-center justify-between bg-black p-4 rounded-lg border border-white/10"
          >
            <span>{banner.id}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBannerChange(banner.id)}
                className={`px-4 py-2 rounded font-bold ${
                  activeBanner === banner.id
                    ? 'bg-pink-500 text-black'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {activeBanner === banner.id ? 'Active' : 'Set Active'}
              </button>
              {banner.isStorageBased && (
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded font-bold"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

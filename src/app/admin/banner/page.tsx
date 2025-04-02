'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { db } from '@/firebase/config'
import { doc, updateDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'

interface Banner {
  id: string
  imageUrl: string
  en: {
    subtitle: string
    altText: string
  }
  es: {
    subtitle: string
    altText: string
  }
  isStorageBased: boolean
  editing?: boolean
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
          imageUrl: enImageUrl,
          en: {
            subtitle: data?.en?.subtitle || '',
            altText: data?.en?.altText || '',
          },
          es: {
            subtitle: data?.es?.subtitle || '',
            altText: data?.es?.altText || '',
          },
          isStorageBased,
          editing: false,
        }
      })
      setBanners(bannersData)

      const settingsSnap = await getDoc(doc(db, 'homepage', 'settings'))
      setActiveBanner(settingsSnap.data()?.activeBanner || '')
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!activeBanner) {
        e.preventDefault()
        e.returnValue = 'You must select an active banner before leaving.'
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [activeBanner])

  const handleBannerChange = async (newBanner: string) => {
    await updateDoc(doc(db, 'homepage', 'settings'), {
      activeBanner: newBanner,
    })
    setActiveBanner(newBanner)
  }

  const handleDeleteBanner = async (bannerId: string) => {
    if (bannerId === activeBanner) {
      alert('You cannot delete the currently active banner. Please set another banner as active first.')
      return
    }

    const confirmed = window.confirm(`Delete banner "${bannerId}"? This cannot be undone.`)
    if (!confirmed) return

    await deleteDoc(doc(db, 'banners', bannerId))
    setBanners((prev) => prev.filter((b) => b.id !== bannerId))
  }

  const handleEditToggle = (id: string) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, editing: !b.editing } : b)))
  }

  const handleUpdateBanner = async (
    id: string,
    enSubtitle: string,
    enAltText: string,
    esSubtitle: string,
    esAltText: string
  ) => {
    await updateDoc(doc(db, 'banners', id), {
      'en.subtitle': enSubtitle,
      'en.altText': enAltText,
      'es.subtitle': esSubtitle,
      'es.altText': esAltText,
    })
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              en: { subtitle: enSubtitle, altText: enAltText },
              es: { subtitle: esSubtitle, altText: esAltText },
              editing: false,
            }
          : b
      )
    )
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
        onClick={() => {
          if (!activeBanner) {
            alert('Please select an active banner before leaving this page.')
            return
          }
          router.push('/admin')
        }}
        disabled={!activeBanner}
        className={`mb-6 text-sm px-4 py-2 rounded border border-white/20 ${
          !activeBanner
            ? 'bg-white/10 text-white/40 cursor-not-allowed'
            : 'text-white hover:text-pink-400'
        }`}
      >
        ← Back to Admin Dashboard
      </button>

      <ul className="space-y-6">
        {banners.map((banner) => (
          <li
            key={banner.id}
            className="flex flex-col bg-black p-4 rounded-lg border border-white/10"
          >
            <div className="sm:flex sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 relative">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.en.altText || banner.id}
                    fill
                    className="object-cover rounded border border-white/10"
                  />
                </div>
                <div className="w-full max-w-xl">
                  <p className="font-bold text-white text-sm mb-1">
                    ID: <span className="text-pink-400">{banner.id}</span>
                  </p>

                  {!banner.editing ? (
                    <>
                      <p className="text-white/70 text-sm">
                        <strong>EN Subtitle:</strong> {banner.en.subtitle}
                      </p>
                      <p className="text-white/70 text-sm mb-2">
                        <strong>EN Alt Text:</strong> {banner.en.altText}
                      </p>
                      <p className="text-white/70 text-sm">
                        <strong>ES Subtitle:</strong> {banner.es.subtitle}
                      </p>
                      <p className="text-white/70 text-sm mb-2">
                        <strong>ES Alt Text:</strong> {banner.es.altText}
                      </p>
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium text-white/70 mb-1 block">
                        EN Subtitle
                      </label>
                      <input
                        className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                        value={banner.en.subtitle}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((b) =>
                              b.id === banner.id
                                ? { ...b, en: { ...b.en, subtitle: e.target.value } }
                                : b
                            )
                          )
                        }
                      />

                      <label className="text-sm font-medium text-white/70 mb-1 block">
                        EN Alt Text
                      </label>
                      <input
                        className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                        value={banner.en.altText}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((b) =>
                              b.id === banner.id
                                ? { ...b, en: { ...b.en, altText: e.target.value } }
                                : b
                            )
                          )
                        }
                      />

                      <label className="text-sm font-medium text-white/70 mb-1 block">
                        ES Subtitle
                      </label>
                      <input
                        className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                        value={banner.es.subtitle}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((b) =>
                              b.id === banner.id
                                ? { ...b, es: { ...b.es, subtitle: e.target.value } }
                                : b
                            )
                          )
                        }
                      />

                      <label className="text-sm font-medium text-white/70 mb-1 block">
                        ES Alt Text
                      </label>
                      <input
                        className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                        value={banner.es.altText}
                        onChange={(e) =>
                          setBanners((prev) =>
                            prev.map((b) =>
                              b.id === banner.id
                                ? { ...b, es: { ...b.es, altText: e.target.value } }
                                : b
                            )
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          handleUpdateBanner(
                            banner.id,
                            banner.en.subtitle,
                            banner.en.altText,
                            banner.es.subtitle,
                            banner.es.altText
                          )
                        }
                        className="bg-pink-500 text-black px-4 py-2 rounded font-bold hover:bg-pink-600"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
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
                  <>
                    <button
                      onClick={() => handleEditToggle(banner.id)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-bold"
                    >
                      {banner.editing ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded font-bold"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

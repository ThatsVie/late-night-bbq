'use client'

import { auth } from '@/firebase/config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getAuth } from 'firebase/auth'

interface Banner {
  id: string
  imageUrl: string
  en: { subtitle: string; altText: string }
  es: { subtitle: string; altText: string }
  shape: 'square' | 'rect'
  isStorageBased: boolean
  editing?: boolean
}

export default function EditBannerPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [activeBanner, setActiveBanner] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const fetchData = async () => {
      const user = auth.currentUser
      const token = user ? await user.getIdToken() : null

      const [bannersRes, activeRes] = await Promise.all([
        fetch('/api/admin/banner/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('/api/banner/active'),
      ])

      const bannersData = await bannersRes.json()
      const activeData = await activeRes.json()
      setBanners(Array.isArray(bannersData) ? bannersData : [])
      setActiveBanner(activeData?.id || '')
    }
    fetchData()
  }, [mounted])

  const getToken = async () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('User not authenticated')
    return user.getIdToken()
  }

  const autoTranslate = async (text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'es' }),
      })
      const data = await res.json()
      return data.translatedText || ''
    } catch (err) {
      console.error('Translation failed:', err)
      return ''
    }
  }

  const handleLiveInputChange = async (
    id: string,
    field: 'subtitle' | 'altText',
    value: string
  ) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, en: { ...b.en, [field]: value } } : b
      )
    )

    clearTimeout((window as any)[`_bannerTranslate_${field}`])
    ;(window as any)[`_bannerTranslate_${field}`] = setTimeout(async () => {
      const translated = await autoTranslate(value)
      setBanners((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, es: { ...b.es, [field]: translated } } : b
        )
      )
    }, 400)
  }

  const handleUpdateBanner = async (
    id: string,
    enSubtitle: string,
    enAltText: string,
    esSubtitle: string,
    esAltText: string
  ) => {
    if (!enSubtitle.trim() || !enAltText.trim() || !esSubtitle.trim() || !esAltText.trim()) {
      alert('Please fill out all fields before saving.')
      return
    }

    const token = await getToken()
    await fetch(`/api/admin/banner/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        en: { subtitle: enSubtitle, altText: enAltText },
        es: { subtitle: esSubtitle, altText: esAltText },
      }),
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

  const handleEditToggle = (id: string) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, editing: !b.editing } : b)))

  const handleBannerChange = async (newBanner: string) => {
    const token = await getToken()
    await fetch('/api/admin/banner/active', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: newBanner }),
    })
    setActiveBanner(newBanner)
  }
  
  const handleDeleteBanner = async (id: string) => {
    const token = await getToken()
    await fetch(`/api/admin/banner/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setBanners((prev) => prev.filter((b) => b.id !== id))
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
  
      {banners.length === 0 ? (
        <p className="text-white/60 italic">No banners found.</p>
      ) : (
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
  
                    {banner.editing ? (
                      <>
                        <label className="text-sm font-medium text-white/70 mb-1 block">EN Subtitle</label>
                        <input
                          className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                          value={banner.en.subtitle}
                          onChange={(e) => handleLiveInputChange(banner.id, 'subtitle', e.target.value)}
                        />
  
                        <label className="text-sm font-medium text-white/70 mb-1 block">EN Alt Text</label>
                        <input
                          className="w-full p-2 mb-4 bg-zinc-900 border border-white/20 rounded"
                          value={banner.en.altText}
                          onChange={(e) => handleLiveInputChange(banner.id, 'altText', e.target.value)}
                        />
  
                        <label className="text-sm font-medium text-white/70 mb-1 block">ES Subtitle</label>
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
  
                        <label className="text-sm font-medium text-white/70 mb-1 block">ES Alt Text</label>
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
                    ) : (
                      <>
                        <p className="text-white/70 text-sm"><strong>EN Subtitle:</strong> {banner.en.subtitle}</p>
                        <p className="text-white/70 text-sm mb-2"><strong>EN Alt Text:</strong> {banner.en.altText}</p>
                        <p className="text-white/70 text-sm"><strong>ES Subtitle:</strong> {banner.es.subtitle}</p>
                        <p className="text-white/70 text-sm mb-2"><strong>ES Alt Text:</strong> {banner.es.altText}</p>
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
                        : 'bg-white/10 hover:bg-white/20 text-white'
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
      )}
    </main>
  )
}
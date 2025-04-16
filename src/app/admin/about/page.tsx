
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CropModal from '@/components/CropModal'
import i18n from '@/i18n'
import { getAuth } from 'firebase/auth'

export default function ManageAboutPage() {
  const router = useRouter()
  const [formState, setFormState] = useState({ en: { content: '' }, es: { content: '' } })
  const [images, setImages] = useState<string[]>([])
  const [activeImage, setActiveImage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    const load = async () => {
      const lang = i18n.language || 'en'
      const res = await fetch(`/api/about?lang=${lang}`)
      const data = await res.json()
      setFormState({
        en: { content: data?.en?.content || '' },
        es: { content: data?.es?.content || '' },
      })
      setImages(data?.images || [])
      setActiveImage(data?.activeImage || '')
    }
    load()
  }, [])

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setShowCropper(true)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreview(null)
    }
  }, [file])

  const getAdminToken = async () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('User not authenticated')
    return user.getIdToken()
  }

  const handleAutoTranslate = async (text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'es' }),
      })
      const data = await res.json()
      return data.translatedText
    } catch (err) {
      console.error('Translation error:', err)
      return ''
    }
  }

  const handleContentChange = async (lang: 'en' | 'es', value: string) => {
    setFormState((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        content: value,
      },
    }))

    // Auto-translate English to Spanish if editing EN
    if (lang === 'en') {
      clearTimeout((window as any)._aboutTranslateTimeout)
      ;(window as any)._aboutTranslateTimeout = setTimeout(async () => {
        if (!value.trim()) return
        const translated = await handleAutoTranslate(value)
        setFormState((prev) => {
          if (!prev.es.content || prev.es.content.trim() === '') {
            return {
              ...prev,
              es: { content: translated },
            }
          }
          return prev
        })
      }, 500)
    }
  }

  const handleCroppedImage = async (croppedFile: File) => {
    setLoading(true)
    try {
      const token = await getAdminToken()
      const formData = new FormData()
      formData.append('file', croppedFile)

      const uploadRes = await fetch('/api/admin/about/images', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { url } = await uploadRes.json()
      setImages((prev) => [...prev, url])
      setActiveImage(url)
    } catch (err) {
      console.error(err)
      alert('There was an error uploading the image.')
    } finally {
      setShowCropper(false)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formState.en.content.trim() || !formState.es.content.trim()) {
      alert('Please fill out both English and Spanish content.')
      return
    }

    if (!activeImage) {
      alert('Please upload and crop an image of the pitmaster.')
      return
    }

    setLoading(true)

    try {
      const token = await getAdminToken()
      const saveContent = async (locale: 'en' | 'es') =>
        fetch('/api/admin/about/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            locale,
            content: formState[locale].content,
            activeImage,
          }),
        })

      await Promise.all([saveContent('en'), saveContent('es')])
      const res = await fetch(`/api/about?lang=${i18n.language}`, { cache: 'no-store' })
      const data = await res.json()
      setFormState({
        en: { content: data?.en?.content || '' },
        es: { content: data?.es?.content || '' },
      })
      setActiveImage(data?.activeImage || '')
      alert('Content saved!')
    } catch (err) {
      console.error(err)
      alert('Error saving content.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetActiveImage = async (url: string) => {
    try {
      const token = await getAdminToken()
      setActiveImage(url)
      await fetch('/api/admin/about/images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activeImage: url }),
      })
    } catch (err) {
      console.error('Failed to set active image', err)
    }
  }

  const handleDeleteImage = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    const token = await getAdminToken()

    await fetch('/api/admin/about/images', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    })

    const updated = images.filter((img) => img !== url)
    setImages(updated)

    if (activeImage === url) {
      const newActive = updated[0] || ''
      setActiveImage(newActive)
      await handleSetActiveImage(newActive)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Edit About the Pitmaster</h1>

      <button
        onClick={() => router.push('/admin')}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Admin Dashboard
      </button>

      <section className="mb-10 bg-black p-6 rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Pitmaster Image</h2>

        <label className="block mb-2 font-medium text-white/80">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-black hover:file:bg-pink-600"
        />

        {(preview || activeImage) && (
          <div className="mt-4">
            <p className="text-sm text-white/60 mb-2">Current Preview:</p>
            <Image
              src={preview || activeImage}
              alt="Pitmaster Preview"
              width={400}
              height={300}
              className="rounded border border-white/20 object-cover"
            />
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-white/60 mb-2">Uploaded Images:</p>
            <div className="flex flex-wrap gap-4">
              {images.map((url) => (
                <div key={url} className="relative group">
                  <Image
                    src={url}
                    alt="Pitmaster image"
                    width={100}
                    height={100}
                    className={`rounded border ${
                      url === activeImage ? 'border-pink-500' : 'border-white/20'
                    }`}
                    onClick={() => handleSetActiveImage(url)}
                  />
                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="absolute -top-1 -right-1 bg-red-600 text-xs text-white px-1 rounded hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        {['en', 'es'].map((lang) => (
          <div key={lang} className="mb-6">
            <label className="block mb-2 text-white/80 font-medium">
              About Content ({lang === 'en' ? 'English' : 'Spanish'})
            </label>
            <p className="text-white/50 text-xs mb-2">
              Press Enter to add line breaks and format paragraphs.
            </p>
            <textarea
              className="w-full p-3 bg-zinc-900 border border-white/20 rounded"
              rows={6}
              value={formState[lang as 'en' | 'es'].content}
              onChange={(e) => handleContentChange(lang as 'en' | 'es', e.target.value)}
              placeholder={`Enter about content in ${lang === 'en' ? 'English' : 'Spanish'}...`}
            />
          </div>
        ))}
      </section>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`bg-pink-500 hover:bg-pink-600 text-black font-bold py-2 px-6 rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      {showCropper && preview && (
        <CropModal
          imageSrc={preview}
          onClose={() => {
            setShowCropper(false)
            setFile(null)
            setPreview(null)
          }}
          onCropComplete={handleCroppedImage}
        />
      )}
    </main>
  )
}

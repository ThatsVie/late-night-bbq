'use client'
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CropModal from '@/components/CropModal'
import i18n from '@/i18n';

export default function ManageAboutPage() {
  const router = useRouter()
  const [content, setContent] = useState({ en: '', es: '' })
  const [images, setImages] = useState<string[]>([])
  const [activeImage, setActiveImage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    const load = async () => {
      const lang = i18n.language || 'en';
      console.log('language used for API request:', lang);
      const res = await fetch(`/api/about?lang=${lang}`)
      const data = await res.json()
      console.log('data loaded from API:', data);
      
      setContent({
        en: data?.en?.content || '',
        es: data?.es?.content || ''
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

  const handleCroppedImage = async (croppedFile: File) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', croppedFile)

      const uploadRes = await fetch ('/api/about/images', {
        method: 'POST',
        body: formData
      })

      const { url } = await uploadRes.json()
      const newImages = [...images, url]

      setImages(newImages)
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
  if (!content.en.trim() || !content.es.trim()) {
    alert('Please fill out both English and Spanish content.')
    return
  }
  
  if (!activeImage) {
    alert('Please upload and crop an image of the pitmaster.')
    return
  }
  
  setLoading(true)
  
  try {
    const saveContent = async (locale: 'en' | 'es') =>
      fetch('/api/about/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, content: content[locale], activeImage }),
      })
      
      await Promise.all([saveContent('en'), saveContent('es')])
      const res = await fetch(`/api/about?lang=${i18n.language}`)
      const data = await res.json()
      setActiveImage(data?.activeImage || '')
      alert('Content saved!')
    } catch (err) {
      console.error(err)
      alert('error saving content.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetActiveImage = async (url: string) => {
    setActiveImage(url)
    await fetch ('/api/about/images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeImage: url }),
    })
  }

  const handleDeleteImage = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    await fetch('/api/about/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    
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

      {/* Upload Image */}
      <section className="mb-10 bg-black p-6 rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Pitmaster Image</h2>

        <label className="block mb-2 font-medium text-white/80">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          id="about-image-upload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <label
          htmlFor="about-image-upload"
          className="inline-block bg-white/10 text-white px-4 py-2 rounded cursor-pointer hover:bg-white/20"
        >
          Choose Image
        </label>

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
                    className={`rounded border ${url === activeImage ? 'border-pink-500' : 'border-white/20'}`}
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

      {/* English and Spanish Fields */}
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
              value={content[lang as 'en' | 'es']}
              onChange={(e) => setContent((prev) => ({ ...prev, [lang]: e.target.value }))}
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

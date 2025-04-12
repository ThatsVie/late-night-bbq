'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getAuth } from 'firebase/auth'
import CropModal from '@/components/CropModal'
import CropRectModal from '@/components/CropRectModal'

export default function UploadBannerPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropMode, setCropMode] = useState<'square' | 'rect'>('square')
  const [uploaded, setUploaded] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: '',
    en: { title: '', subtitle: '', altText: '' },
    es: { title: '', subtitle: '', altText: '' },
  })

  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setFileUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  useEffect(() => {
    if (!croppedFile) return
    const objectUrl = URL.createObjectURL(croppedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [croppedFile])

  const handleChange = (lang: 'en' | 'es', key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }))
  }

  const handleFileChange = (incomingFile: File | null) => {
    if (!incomingFile) return
    setFile(incomingFile)
    setShowCropModal(true)
  }

  const handleCropComplete = (cropped: File) => {
    setCroppedFile(cropped)
    setShowCropModal(false)
  }

  const handleUpload = async () => {
    if (!croppedFile || !formData.id) {
      alert('Please crop an image and provide a Banner ID.')
      return
    }

    const isMissingField =
      !formData.en.subtitle || !formData.es.subtitle || !formData.en.altText || !formData.es.altText

    if (isMissingField) {
      alert('Please fill out all required text fields.')
      return
    }

    const auth = getAuth()
    const user = auth.currentUser
    const token = user && (await user.getIdToken())

    if (!token) {
      alert('Authentication failed. Please log in again.')
      return
    }

    const form = new FormData()
    form.append('file', croppedFile)

    try {
      const uploadRes = await fetch('/api/admin/banner/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      const { url } = await uploadRes.json()

      const bannerDoc = {
        en: { ...formData.en, imageUrl: url },
        es: { ...formData.es, imageUrl: url },
        shape: cropMode,
      }

      const saveRes = await fetch(`/api/admin/banner/${formData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerDoc),
      })

      if (!saveRes.ok) {
        throw new Error('Failed to save banner document')
      }

      setUploaded(true)
    } catch (error) {
      console.error('Error uploading banner:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="p-6 text-white bg-zinc-950 min-h-screen">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Upload New Homepage Banner</h1>

      <button
        onClick={() => router.push('/admin/banner')}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Banners
      </button>

      {uploaded ? (
        <div className="text-center mt-10">
          <p className="text-green-400 font-semibold mb-4">Banner uploaded successfully!</p>
          <p className="text-white/80 mb-6">You can now activate it from the Banner page.</p>
        </div>
      ) : (
        <>
          <label className="block mb-2 font-semibold text-white">
            Banner ID{' '}
            <span className="text-white/60 text-sm">(used internally to identify this banner)</span>
          </label>
          <input
            type="text"
            className="w-full p-2 mb-4 bg-black border border-white/20 rounded"
            placeholder="e.g., Summer_Special"
            value={formData.id}
            onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
          />

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-white">
              Upload Image <span className="text-white/60 text-sm">(JPG/PNG)</span>
            </label>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm">
                <input
                  type="radio"
                  name="cropMode"
                  value="square"
                  checked={cropMode === 'square'}
                  onChange={() => setCropMode('square')}
                  className="mr-2"
                />
                Square
              </label>
              <label className="text-sm">
                <input
                  type="radio"
                  name="cropMode"
                  value="rect"
                  checked={cropMode === 'rect'}
                  onChange={() => setCropMode('rect')}
                  className="mr-2"
                />
                Rectangle
              </label>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-black hover:file:bg-pink-600"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <p className="text-white/70 text-sm mb-2">Cropped Preview:</p>
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={400}
                className="rounded border border-white/10 object-contain"
              />
            </div>
          )}

          {['en', 'es'].map((lang) => (
            <div key={lang} className="mb-6">
              <h2 className="text-lg text-pink-400 font-semibold mb-2">
                {lang.toUpperCase()} Content
              </h2>
              <input
                className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
                placeholder="Title (used for internal reference only)"
                value={formData[lang as 'en' | 'es'].title}
                onChange={(e) => handleChange(lang as 'en' | 'es', 'title', e.target.value)}
              />
              <input
                className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
                placeholder="Subtitle (this appears on the homepage)"
                value={formData[lang as 'en' | 'es'].subtitle}
                onChange={(e) => handleChange(lang as 'en' | 'es', 'subtitle', e.target.value)}
              />
              <input
                className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
                placeholder="Alt Text (for accessibility)"
                value={formData[lang as 'en' | 'es'].altText}
                onChange={(e) => handleChange(lang as 'en' | 'es', 'altText', e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={handleUpload}
            className="bg-pink-500 hover:bg-pink-600 text-black px-6 py-3 rounded font-bold"
          >
            Upload Banner
          </button>
        </>
      )}

      {showCropModal && fileUrl && (
        cropMode === 'square' ? (
          <CropModal
            imageSrc={fileUrl}
            onClose={() => setShowCropModal(false)}
            onCropComplete={handleCropComplete}
          />
        ) : (
          <CropRectModal
            imageSrc={fileUrl}
            onClose={() => setShowCropModal(false)}
            onCropComplete={handleCropComplete}
          />
        )
      )}
    </main>
  )
}

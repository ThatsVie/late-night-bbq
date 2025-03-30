'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/firebase/config'
import { collection, setDoc, doc } from 'firebase/firestore'
import { uploadBannerImage } from '@/utils/uploadBannerImage'

export default function UploadBannerPage() {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    en: { title: '', subtitle: '', altText: '' },
    es: { title: '', subtitle: '', altText: '' },
  })

  const handleChange = (lang: 'en' | 'es', key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }))
  }

  const handleUpload = async () => {
    if (!file || !formData.id) {
      alert('Please select an image and provide a banner ID')
      return
    }

    const imageUrl = await uploadBannerImage(file)

    const bannerDoc = {
      en: { ...formData.en, imageUrl },
      es: { ...formData.es, imageUrl },
    }

    await setDoc(doc(collection(db, 'banners'), formData.id), bannerDoc)
    setUploaded(true)
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/admin/banner')}
              className="bg-pink-500 hover:bg-pink-600 text-black px-6 py-2 rounded font-bold"
            >
              Go to Banners
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded font-bold"
            >
              Back to Admin Dashboard
            </button>
          </div>
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

          <label className="block mb-2 font-semibold text-white">
            Upload Image File{' '}
            <span className="text-white/60 text-sm">(JPG/PNG, 1024x1024 recommended)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-black hover:file:bg-pink-600"
          />

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
    </main>
  )
}

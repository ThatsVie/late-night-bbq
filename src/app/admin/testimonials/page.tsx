
'use client'
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'

export interface TestimonialLocale {
  name: string
  quote: string
}

export interface TestimonialData {
  en: TestimonialLocale
  es: TestimonialLocale
}

export interface TestimonialWithId extends TestimonialData {
  id: string
}

export default function ManageTestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<TestimonialWithId[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTestimonial, setNewTestimonial] = useState<TestimonialData>({
    en: { name: '', quote: '' },
    es: { name: '', quote: '' },
  })

  useEffect(() => {
    fetchAllTestimonials()
  }, [])

  const fetchAllTestimonials = async () => {
    const response = await fetch('/api/testimonials')
    const data = await response.json()
    setTestimonials(data)
  }

  const handleInputChange = (lang: 'en' | 'es', field: 'name' | 'quote', value: string) => {
    setNewTestimonial((prev) => {
      const updated = {
        ...prev,
        [lang]: { ...prev[lang], [field]: value },
      }
  
      // Auto-translate from English to Spanish if editing English fields
      if (lang === 'en') {
        clearTimeout((window as any)._translateTimeout)
        ;(window as any)._translateTimeout = setTimeout(async () => {
          if (value.trim()) {
            try {
              const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: value,
                  targetLang: 'es',
                }),
              })
              const data = await res.json()
              if (data.translatedText) {
                setNewTestimonial((prev) => ({
                  ...prev,
                  es: {
                    ...prev.es,
                    [field]: data.translatedText,
                  },
                }))
              }
            } catch (err) {
              console.error('Translation failed:', err)
            }
          }
        }, 500)
      }
  
      return updated
    })
  }
  
  const getAdminToken = async () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('User not authenticated')
    return user.getIdToken()
  }

  const handleSubmit = async () => {
    const token = await getAdminToken()
    if (!token) {
      alert('Authentication failed. Please login again.')
      return
    }

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId
      ? `/api/admin/testimonials/${editingId}`
      : '/api/admin/testimonials'

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTestimonial),
    })

    await fetchAllTestimonials()
    setNewTestimonial({ en: { name: '', quote: '' }, es: { name: '', quote: '' } })
    setEditingId(null)
  }

  const handleEdit = (testimonial: TestimonialWithId) => {
    setEditingId(testimonial.id)
    setNewTestimonial({
      en: { name: testimonial.en.name, quote: testimonial.en.quote },
      es: { name: testimonial.es.name, quote: testimonial.es.quote },
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    const token = await getAdminToken()
    if (!token) {
      alert('Authentication failed. Please login again.')
      return
    }

    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    await fetchAllTestimonials()
  }

  return (
    <main className="p-6 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Manage Testimonials</h1>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            router.push('/admin')
          }
        }}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Admin Dashboard
      </button>

      {/* Form */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {['en', 'es'].map((lang) => (
          <div key={lang}>
            <h2 className="text-lg text-pink-400 mb-2 font-semibold">{lang.toUpperCase()}</h2>
            <input
              placeholder="Name"
              className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
              value={newTestimonial[lang as 'en' | 'es'].name}
              onChange={(e) => handleInputChange(lang as 'en' | 'es', 'name', e.target.value)}
            />
            <textarea
              placeholder="Quote"
              className="w-full p-2 mb-2 bg-black border border-white/20 rounded"
              value={newTestimonial[lang as 'en' | 'es'].quote}
              onChange={(e) => handleInputChange(lang as 'en' | 'es', 'quote', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-pink-500 hover:bg-pink-600 text-black px-6 py-2 rounded font-bold mb-10"
      >
        {editingId ? 'Update' : 'Add'} Testimonial
      </button>

      {/* Existing testimonials */}
      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="bg-black border border-white/10 p-4 rounded-lg">
            <p className="text-white/80 italic mb-2">
              EN: “{t.en.quote}” — {t.en.name}
            </p>
            <p className="text-white/80 italic mb-2">
              ES: “{t.es.quote}” — {t.es.name}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(t)}
                className="text-sm text-pink-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

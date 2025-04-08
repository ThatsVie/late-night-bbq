'use client'
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    setNewTestimonial((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }))
  }

  const handleSubmit = async () => {
    if (editingId) {
      await fetch(`/api/testimonials/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newTestimonial),
      })
    } else {
      await fetch ('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newTestimonial),
      })
    }

    await fetchAllTestimonials()
    setNewTestimonial({ en: { name: '', quote: '' }, es: { name: '', quote: '' } })
    setEditingId(null)
  }

  const handleEdit = (testimonial: TestimonialWithId) => {
    setEditingId(testimonial.id)
    setNewTestimonial({ en: testimonial.en, es: testimonial.es })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })
      await fetchAllTestimonials()
    }
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

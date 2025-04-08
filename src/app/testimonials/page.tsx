'use client'
export const dynamic = 'force-dynamic';

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

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

export default function TestimonialsPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [testimonials, setTestimonials] = useState<TestimonialWithId[]>([])

  useEffect(() => {
    setMounted(true)
    fetchAllTestimonials()
  }, [])

  const fetchAllTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      setTestimonials(data)
    } catch (err) {
      console.error('Error fetching testimonials', err)
    }
  }
  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      <section className="text-center mb-12" aria-labelledby="testimonials-heading" role="region">
        <h1 id="testimonials-heading" className="text-5xl font-bold pinkText neon-text tilt-neon-font mb-4">
          {t('testimonials.title')}
        </h1>
        <p className="pinkText tilt-neon-font max-w-2xl mx-auto">{t('testimonials.intro')}</p>
      </section>

      <section className="max-w-4xl mx-auto space-y-8" aria-label="Customer testimonials">
        {testimonials.map(({ id, en, es }) => {
          const quote = i18n.language === 'es' ? es.quote : en.quote
          const name = i18n.language === 'es' ? es.name : en.name
        return (
          <blockquote
            key={id}
            className='bg-zinc-900 p-6 rounded-xl border border-white/10 shadow'
            >
              <p className='text-lg text-white/90 italic'>"{quote}"</p>
              <footer className='mt-4 text-sm text-white/60'>- {name}</footer>
            </blockquote>
            )
          })}
      </section>
    </main>
  )
}

'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { fetchTestimonials } from '@/utils/fetchTestimonials'

type Testimonial = {
  quote: string
  name: string
}

export default function TestimonialsPage() {
  const { t, i18n } = useTranslation()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await fetchTestimonials(i18n.language as 'en' | 'es')
      setTestimonials(data)
    }

    loadTestimonials()
    setMounted(true)
  }, [i18n.language])

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
        {testimonials.map(({ quote, name }, index) => (
          <blockquote
            key={index}
            className="bg-zinc-900 p-6 rounded-xl border border-white/10 shadow"
          >
            <p className="text-lg text-white/90 italic">“{quote}”</p>
            <footer className="mt-4 text-sm text-white/60">— {name}</footer>
          </blockquote>
        ))}
      </section>
    </main>
  )
}

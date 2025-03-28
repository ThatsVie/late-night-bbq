'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function TestimonialsPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      <section className="text-center mb-12" aria-labelledby="testimonials-heading" role="region">
        <h1 id="testimonials-heading" className="text-4xl font-bold text-pink-500 mb-4">
          {t('testimonials.title')}
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">{t('testimonials.intro')}</p>
      </section>

      <section className="max-w-4xl mx-auto space-y-8" aria-label="Customer testimonials">
        {[1, 2, 3].map((id) => (
          <blockquote key={id} className="bg-zinc-900 p-6 rounded-xl border border-white/10 shadow">
            <p className="text-lg text-white/90 italic">
              “{t(`testimonials.placeholder.quote${id}`)}”
            </p>
            <footer className="mt-4 text-sm text-white/60">
              — {t(`testimonials.placeholder.name${id}`)}
            </footer>
          </blockquote>
        ))}
      </section>
    </main>
  )
}

'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function AboutPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      {/* Title + Intro */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">{t('about.title')}</h1>
        <p className="text-white/80 max-w-2xl mx-auto">{t('about.intro')}</p>
      </section>

      {/* Story Section */}
      <section className="max-w-3xl mx-auto space-y-8 text-lg text-white/90">
        <p>{t('about.story.p1')}</p>
        <p>{t('about.story.p2')}</p>
        <p>{t('about.story.p3')}</p>
      </section>

      {/* Quote or Mission */}
      <section className="mt-16 text-center">
        <blockquote className="text-pink-400 italic text-xl max-w-xl mx-auto border-l-4 border-pink-500 pl-4">
          {t('about.quote')}
        </blockquote>
      </section>
    </main>
  )
}

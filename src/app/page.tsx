'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function Home() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white" id="main-content">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20"
        aria-labelledby="hero-heading"
        role="region"
      >
        <h1 id="hero-heading" className="text-5xl font-bold text-pink-500 mb-4">
          {t('hero.title')} 🔥
        </h1>
        <p className="text-xl max-w-xl text-white/80">{t('hero.tagline')}</p>
      </section>

      {/* How It Works */}
      <section
        className="bg-zinc-900 px-6 py-20 text-center"
        aria-labelledby="how-heading"
        role="region"
      >
        <h2 id="how-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('howItWorks.title')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('howItWorks.body')}</p>
      </section>

      {/* Our Story */}
      <section
        className="bg-zinc-950 px-6 py-20 text-center"
        aria-labelledby="story-heading"
        role="region"
      >
        <h2 id="story-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('story.title')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('story.body')}</p>
      </section>

      {/* Menu Highlights */}
      <section
        className="bg-zinc-900 px-6 py-20 text-center"
        aria-labelledby="menu-heading"
        role="region"
      >
        <h2 id="menu-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('menu.title')}
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-4xl mx-auto">
          {['item1', 'item2', 'item3'].map((itemKey) => (
            <div
              key={itemKey}
              className="bg-black p-6 rounded-xl border border-white/10"
              role="group"
              aria-labelledby={`item-${itemKey}-heading`}
            >
              <h3 id={`item-${itemKey}-heading`} className="text-xl font-semibold mb-2">
                {t(`menu.items.${itemKey}.name`)}
              </h3>
              <p className="text-white/70">{t(`menu.items.${itemKey}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-black px-6 py-20 text-center"
        aria-labelledby="cta-heading"
        role="region"
      >
        <h2 id="cta-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-white/80 mb-6">{t('cta.body')}</p>
        <a
          href="/booking"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-black font-bold py-3 px-6 rounded-full transition focus:outline focus:ring-2 focus:ring-pink-400"
        >
          {t('cta.button')}
        </a>
      </section>
    </main>
  )
}

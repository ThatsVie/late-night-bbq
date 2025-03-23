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
    <main className="bg-black text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
        <h1 className="text-5xl font-bold text-pink-500 mb-4">{t('hero.title')} 🔥</h1>
        <p className="text-xl max-w-xl text-white/80">{t('hero.tagline')}</p>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-900 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">{t('howItWorks.title')}</h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('howItWorks.body')}</p>
      </section>

      {/* Our Story */}
      <section className="bg-zinc-950 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">{t('story.title')}</h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('story.body')}</p>
      </section>

      {/* Menu Highlights */}
      <section className="bg-zinc-900 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">{t('menu.title')}</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-4xl mx-auto">
          {['item1', 'item2', 'item3'].map((itemKey) => (
            <div key={itemKey} className="bg-black p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-2">{t(`menu.items.${itemKey}.name`)}</h3>
              <p className="text-white/70">{t(`menu.items.${itemKey}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">{t('cta.title')}</h2>
        <p className="text-white/80 mb-6">{t('cta.body')}</p>
        <a
          href="/booking"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-black font-bold py-3 px-6 rounded-full transition"
        >
          {t('cta.button')}
        </a>
      </section>
    </main>
  )
}

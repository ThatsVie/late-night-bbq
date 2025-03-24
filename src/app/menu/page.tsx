'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function MenuPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const items = ['brisket', 'ribs', 'mac']

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">{t('menuPage.title')}</h1>
        <p className="text-white/70 mb-12">{t('menuPage.description')}</p>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map((key) => (
            <div
              key={key}
              className="bg-zinc-900 p-6 rounded-xl border border-white/10 hover:border-pink-400 transition-all hover:shadow-lg"
            >
              <h2 className="text-xl font-bold text-pink-400 mb-2">
                {t(`menuPage.items.${key}.name`)}
              </h2>
              <p className="text-white/80 text-sm mb-3">{t(`menuPage.items.${key}.desc`)}</p>
              <p className="text-white/60 text-sm italic">{t(`menuPage.items.${key}.price`)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

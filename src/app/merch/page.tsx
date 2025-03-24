'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function MerchPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const items = ['shirt', 'sauce', 'gift']

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">{t('merchPage.title')}</h1>
        <p className="text-white/70 mb-12">{t('merchPage.description')}</p>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map((key) => (
            <div
              key={key}
              className="bg-zinc-900 p-6 rounded-xl border border-white/10 hover:border-pink-400 transition-all hover:shadow-lg"
            >
              <h2 className="text-xl font-bold text-pink-400 mb-2">
                {t(`merchPage.items.${key}.name`)}
              </h2>
              <p className="text-white/80 text-sm mb-3">{t(`merchPage.items.${key}.desc`)}</p>
              <span className="text-xs uppercase text-white/50 bg-zinc-800 px-2 py-1 rounded">
                {t(`merchPage.items.${key}.status`)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchMerchItems } from '@/utils/merchService'
import type { MerchItemData } from '@/utils/merchService'

export default function MerchPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<(MerchItemData & { id: string })[]>([])

  useEffect(() => {
    setMounted(true)
    const load = async () => {
      const data = await fetchMerchItems()
      setItems(data)
    }
    load()
  }, [])

  if (!mounted) return null

  const lang = i18n.language as 'en' | 'es'

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold pinkText neon-text tilt-neon-font mb-4">{t('merchPage.title')}</h1>
        <p className="text-white/70 mb-12">{t('merchPage.description')}</p>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 p-6 rounded-xl border border-white/10 hover:border-pink-400 transition-all hover:shadow-lg"
            >
              {item.activeImage && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={item.activeImage}
                    alt={item[lang].title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold pinkText mb-2">{item[lang].title}</h2>
              <p className="text-white/80 text-sm">{item[lang].description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

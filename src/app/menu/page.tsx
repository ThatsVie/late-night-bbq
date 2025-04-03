'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { fetchMenuItems, MenuItemData, MenuCategory } from '@/utils/menuService'
import Image from 'next/image'

const CATEGORIES: MenuCategory[] = ['BBQ Meats', 'Sides', 'Fixins']

export default function MenuPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<(MenuItemData & { id: string })[]>([])

  useEffect(() => {
    setMounted(true)
    const loadItems = async () => {
      const data = await fetchMenuItems()
      setItems(data)
    }
    loadItems()
  }, [])

  if (!mounted) return null

  const lang = i18n.language as 'en' | 'es'

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold pinkText neon-text tilt-neon-font mb-4">{t('menuPage.title')}</h1>
        <p className="text-white/70 mb-12">{t('menuPage.description')}</p>

        {CATEGORIES.map((category) => {
          const categoryItems = items
            .filter((item) => item.category === category)
            .sort((a, b) => a.order - b.order)

          if (categoryItems.length === 0) return null

          return (
            <div key={category} className="mb-12 text-left">
              <h2 className="text-2xl font-bold pinkText mb-6">
                {t(`menuPage.categories.${category}`)}
              </h2>

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {categoryItems.map((item) => (
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
                    <h3 className="text-xl font-bold pinkText mb-2">{item[lang].title}</h3>
                    <p className="text-white/80 text-sm mb-3">{item[lang].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}

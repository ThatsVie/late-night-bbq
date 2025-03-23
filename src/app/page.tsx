'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export default function Home() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // prevents hydration mismatch

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-12 sm:py-20 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-pink-500 mb-4">
        {t('title')} 🔥
      </h1>
      <p className="text-lg sm:text-xl max-w-2xl text-white/80">
        {t('tagline')}
      </p>
    </main>
  )
}

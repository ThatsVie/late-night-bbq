'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { i18n, t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(nextLang)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // prevents mismatch during hydration

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-black text-white border-b border-white/10">
      <div className="text-xl font-bold text-pink-500">
        <Link href="/">{t('title')}</Link>
      </div>

      <nav className="flex gap-6 items-center text-sm sm:text-base">
        <Link href="/" className="hover:text-pink-400 transition">{t('nav.home')}</Link>
        <Link href="/about" className="hover:text-pink-400 transition">{t('nav.about')}</Link>
        <Link href="/store" className="hover:text-pink-400 transition">{t('nav.store')}</Link>
        <Link href="/booking" className="hover:text-pink-400 transition">{t('nav.booking')}</Link>
        <Link href="/register" className="hover:text-pink-400 transition">{t('nav.register')}</Link>
        <Link href="/login" className="hover:text-pink-400 transition">{t('nav.login')}</Link>
        <button
          onClick={toggleLanguage}
          className="ml-2 px-3 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
        >
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </button>
      </nav>
    </header>
  )
}

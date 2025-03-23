'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(nextLang)
  }

  if (!mounted) return null

  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10 px-6 py-10 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Footer text */}
        <p className="text-white/60">{t('footer.madeWithLove')}</p>

        {/* Navigation */}
        <nav
          className="flex flex-wrap gap-4 justify-center sm:justify-start"
          aria-label="Footer navigation"
        >
          <Link href="/" className="hover:text-pink-400 transition">
            {t('nav.home')}
          </Link>
          <Link href="/about" className="hover:text-pink-400 transition">
            {t('nav.about')}
          </Link>
          <Link href="/booking" className="hover:text-pink-400 transition">
            {t('nav.booking')}
          </Link>
          <Link href="/register" className="hover:text-pink-400 transition">
            {t('nav.register')}
          </Link>
          <Link href="/login" className="hover:text-pink-400 transition">
            {t('nav.login')}
          </Link>
        </nav>

        {/* Language + Copyright */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="border border-white/20 rounded px-3 py-1 text-xs hover:bg-white hover:text-black transition"
          >
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
          <span className="text-white/40" aria-hidden="true">
            © {new Date().getFullYear()} Late Night BBQ
          </span>
        </div>
      </div>
    </footer>
  )
}

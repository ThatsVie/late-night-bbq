'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { i18n, t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(nextLang)
  }

  if (!mounted) return null

  return (
    <header className="bg-black text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Site title */}
        <Link href="/" className="text-2xl font-bold pinkText tilt-neon-font">
          {t('title')}
        </Link>

        {/* Hamburger toggle for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex gap-6 items-center text-sm sm:text-base"
          aria-label="Main navigation"
        >
          <Link href="/" className="hover:text-pink-400">
            {t('nav.home')}
          </Link>
          <Link href="/about" className="hover:text-pink-400">
            {t('nav.about')}
          </Link>
          <Link href="/menu" className="hover:text-pink-400">
            {t('nav.store')}
          </Link>
          <Link href="/merch" className="hover:text-pink-400">
            {t('nav.merch')}
          </Link>
          <Link href="/testimonials" className="hover:text-pink-400">
            {t('nav.testimonials')}
          </Link>
          <Link href="/contact" className="hover:text-pink-400">
            {t('nav.contact')}
          </Link>
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="ml-2 px-3 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
          >
            {i18n.language === 'en' ? 'Español' : 'English'}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <nav
          className="md:hidden px-6 pb-4 space-y-2 bg-black border-t border-white/10"
          aria-label="Mobile navigation"
        >
          <Link href="/" className="block hover:text-pink-400" onClick={() => setIsOpen(false)}>
            {t('nav.home')}
          </Link>
          <Link
            href="/about"
            className="block hover:text-pink-400"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.about')}
          </Link>
          <Link href="/menu" className="block hover:text-pink-400" onClick={() => setIsOpen(false)}>
            {t('nav.store')}
          </Link>
          <Link
            href="/merch"
            className="block hover:text-pink-400"
            onClick={() => setIsOpen(false)}
          >
            Merch
          </Link>
          <Link href="/testimonials" className="hover:text-pink-400">
            {t('nav.testimonials')}
          </Link>
          <Link
            href="/contact"
            className="block hover:text-pink-400"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.contact')}
          </Link>
          <button
            onClick={() => {
              toggleLanguage()
              setIsOpen(false)
            }}
            aria-label="Toggle language"
            className="inline-block px-3 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
          >
            {i18n.language === 'en' ? 'Español' : 'English'}
          </button>
        </nav>
      )}
    </header>
  )
}

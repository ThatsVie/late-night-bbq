'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { logFirebaseEvent } from '@/utils/logEvent'

export default function Navbar({ handleRouteChange }: { handleRouteChange: (url: string) => void }) {
  const { i18n, t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

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
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault()
            handleRouteChange('/')
          }}
          className="text-2xl font-bold pinkText tilt-neon-font"
        >
          {t('title')}
        </Link>

        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 animate-pulse"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center text-sm sm:text-base" aria-label="Main navigation">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'home', path: '/' })
              handleRouteChange('/') }}
              className={`hover:text-[#E66590] ${pathname === '/' ? 'text-[#E66590]' : ''}`}>
            {t('nav.home')}
          </Link>
          <Link
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'about', path: '/about' })
              handleRouteChange('/about') }}
              className={`hover:text-[#E66590] ${pathname === '/about' ? 'text-[#E66590]' : ''}`}>
            {t('nav.about')}
          </Link>
          <Link
            href="/menu"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'menu', path: '/menu' })
              handleRouteChange('/menu') }}
              className={`hover:text-[#E66590] ${pathname === '/menu' ? 'text-[#E66590]' : ''}`}>
            {t('nav.store')}
          </Link>
          <Link
            href="/merch"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'merch', path: '/merch' })
              handleRouteChange('/merch') }}
              className={`hover:text-[#E66590] ${pathname === '/merch' ? 'text-[#E66590]' : ''}`}>
            {t('nav.merch')}
          </Link>
          <Link
            href="/testimonials"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'testimonials', path: '/testimonials' })
              handleRouteChange('/testimonials') }}
              className={`hover:text-[#E66590] ${pathname === '/testimonials' ? 'text-[#E66590]' : ''}`}>
            {t('nav.testimonials')}
          </Link>
          <Link
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              logFirebaseEvent('navbar_click', { label: 'contact', path: '/contact' })
              handleRouteChange('/contact') }}
              className={`hover:text-[#E66590] ${pathname === '/contact' ? 'text-[#E66590]' : ''}`}>
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

      {/* Mobile nav */}
      {isOpen && (
        <nav className="md:hidden px-6 pb-4 space-y-3 bg-black border-t border-white/10 text-base" aria-label="Mobile navigation">
          <Link href="/" className={`block py-2 hover:text-[#E66590] ${pathname === '/' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.home')}
          </Link>
          <Link href="/about" className={`block py-2 hover:text-[#E66590] ${pathname === '/about' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.about')}
          </Link>
          <Link href="/menu" className={`block py-2 hover:text-[#E66590] ${pathname === '/menu' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.store')}
          </Link>
          <Link href="/merch" className={`block py-2 hover:text-[#E66590] ${pathname === '/merch' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.merch')}
          </Link>
          <Link href="/testimonials" className={`block py-2 hover:text-[#E66590] ${pathname === '/testimonials' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.testimonials')}
          </Link>
          <Link href="/contact" className={`block py-2 hover:text-[#E66590] ${pathname === '/contact' ? 'text-[#E66590]' : ''}`} onClick={() => setIsOpen(false)}>
            {t('nav.contact')}
          </Link>
          <button
            onClick={() => {
              toggleLanguage()
              setIsOpen(false)
            }}
            aria-label="Toggle language"
            className="inline-block px-4 py-2 border rounded text-sm hover:bg-white hover:text-black transition"
          >
            {i18n.language === 'en' ? 'Español' : 'English'}
          </button>
        </nav>
      )}
    </header>
  )
}

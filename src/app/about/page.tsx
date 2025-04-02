'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { fetchAboutContent } from '@/utils/aboutService'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const devsSectionRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    const fetchContent = async () => {
      const data = await fetchAboutContent(i18n.language as 'en' | 'es')
      if (data) {
        setContent(data.content)
        setImageUrl(data.activeImage || data.imageUrl)
      }
    }

    fetchContent()
  }, [i18n.language])

  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const hash = window.location.hash

      if (hash === '#devs-section' && devsSectionRef.current) {
        setTimeout(() => {
          devsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 150) // wait for hydration
      }
    }
  }, [mounted, pathname])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      {/* About the Pitmaster */}
      <section className="text-center mb-16" aria-labelledby="pitmaster-heading" role="region">
        <h1 id="pitmaster-heading" className="text-4xl font-bold text-pink-500 mb-6">
          {t('about.pitmasterTitle')}
        </h1>
        {imageUrl && (
          <div className="mx-auto mb-6 w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 relative rounded overflow-hidden border border-white/20 shadow-lg">
            <Image
              src={imageUrl}
              alt={t('about.pitmasterTitle')}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 15rem, (max-width: 768px) 20rem, 24rem"
              priority
            />
          </div>
        )}
        <p className="text-white font-semibold text-lg mb-2">{t('about.pitmasterName')}</p>
        <p className="text-white/80 max-w-2xl mx-auto px-4 whitespace-pre-line">{content}</p>
      </section>

      {/* About the Website Developers */}
      <section
        id="devs-section"
        ref={devsSectionRef}
        className="scroll-mt-24 max-w-4xl mx-auto space-y-12 text-lg text-white/90"
        aria-labelledby="devs-section"
        role="region"
      >
        <h2 className="text-2xl font-bold text-pink-400 mb-8 text-center">
          {t('about.devsTitle')}
        </h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-300">Vie P.</h3>
          <p>&ldquo;{t('about.vieQuote')}&rdquo;</p>
          <a
            href="https://whatdoyouknowaboutlove.com/viep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline text-sm"
          >
            {t('about.viewPortfolio')}
          </a>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-pink-300">Courtney G.</h3>
          <p>{t('about.courtneyBio')}</p>
          <a
            href="https://whatdoyouknowaboutlove.com/viep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline text-sm"
          >
            {t('about.viewPortfolio')}
          </a>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-pink-300">Starlee J.</h3>
          <p>{t('about.starleeBio')}</p>
          <a
            href="https://whatdoyouknowaboutlove.com/viep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline text-sm"
          >
            {t('about.viewPortfolio')}
          </a>
        </div>
      </section>
    </main>
  )
}

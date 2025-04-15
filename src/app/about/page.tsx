'use client'
export const dynamic = 'force-dynamic'

import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export interface AboutContent {
  content: string
  imageUrl: string
  images: string[]
  activeImage: string
}

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const devsSectionRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const fetchAboutContent = async () => {
      try {
        const response = await fetch(`/api/about?lang=${i18n.language}`)
        const data = await response.json()
        setContent(data?.[i18n.language]?.content || '')
        setImageUrl(data?.activeImage || '')
      } catch (err) {
        console.error('Error fetching about page', err)
      }
    }
    fetchAboutContent()
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
        <h1 id="pitmaster-heading" className="text-5xl font-bold neon-text tilt-neon-font mb-4">
          {t('about.pitmasterTitle')}
        </h1>
        <p className="pinkText tilt-neon-font font-semibold text-2xl mb-2">
          {t('about.pitmasterName')}
        </p>
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
        <h2 className="text-2xl font-bold pinkText tilt-neon-font mb-8 text-center">
          {t('about.devsTitle')}
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-12 text-center">
          {/* Vie */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold pinkText tilt-neon-font">Vie P.</h3>
            <a
              href="https://whatdoyouknowaboutlove.com/viep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-500 text-black font-semibold text-sm px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              {t('about.viewPortfolio')}
            </a>
          </div>

          {/* Courtney */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold pinkText tilt-neon-font">Courtney G.</h3>
            <a
              href="https://www.linkedin.com/in/courtney-graham918/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-500 text-black font-semibold text-sm px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              LinkedIn
            </a>
          </div>

          {/* Starlee */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold pinkText tilt-neon-font">Starlee J.</h3>
            <a
              href="https://linkedin.com/in/starlee-link" // <-- update this link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-500 text-black font-semibold text-sm px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

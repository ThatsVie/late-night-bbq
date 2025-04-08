'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import FacebookEmbed from '@/components/FacebookEmbed'

function AnimatedSection({ id, children }: { id: string; children: React.ReactNode }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.section
      ref={ref}
      id={id}
      role="region"
      aria-labelledby={`${id}-heading`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="px-6 py-20 text-center"
    >
      {children}
    </motion.section>
  )
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [banner, setBanner] = useState<{
    id?: string
    imageUrl: string
    altText: string
    subtitle: string
    shape?: 'square' | 'rect'
  } | null>(null)

  useEffect(() => {
    setMounted(true)

    async function fetchBanner() {
      try {
        const res = await fetch(`/api/banner/active?locale=${i18n.language}`)
        const data = await res.json()
        if (data?.imageUrl) {
          setBanner(data)
        } else {
          console.warn('No active banner found.')
        }
      } catch (err) {
        console.error('Failed to load homepage banner:', err)
      }
    }

    fetchBanner()
  }, [i18n.language])

  if (!mounted) return null

  return (
    <main className="bg-black text-white" id="main-content">
      {/* Hero Section */}
      <motion.section
        role="region"
        aria-labelledby="hero-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-start text-center px-6 py-20"
      >
        <motion.h1
          id="hero-heading"
          className="text-5xl font-bold neon-text mb-4 flex items-center gap-2 justify-center tilt-neon-font"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {t('hero.title')}
          <motion.span
            role="img"
            aria-label="fire"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            🔥
          </motion.span>
        </motion.h1>

        <p className="text-white/70 text-lg mb-6">{t('tagline')}</p>

        {/* Dynamic Banner */}
        {banner ? (
          <>
            <div
              className={`mx-auto border border-white/10 rounded-lg shadow overflow-hidden ${
                banner.shape === 'rect' ? 'w-[600px] h-[300px]' : 'w-[400px] h-[400px]'
              }`}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.altText}
                width={banner.shape === 'rect' ? 600 : 400}
                height={banner.shape === 'rect' ? 300 : 400}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <p className="text-xl max-w-xl text-white/80 mt-4">{banner.subtitle}</p>
          </>
        ) : (
          <p className="text-white/50 text-sm italic mt-4">No active banner currently set.</p>
        )}
      </motion.section>

      {/* Info Sections */}
      <AnimatedSection id="how">
        <h2 id="how-heading" className="text-3xl tilt-neon-font font-bold pinkText mb-6">
          {t('howItWorks.title')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('howItWorks.body')}</p>
      </AnimatedSection>

      <AnimatedSection id="cta">
        <h2 id="cta-heading" className="text-3xl tilt-neon-font font-bold pinkText mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-white/80 mb-6">{t('cta.body')}</p>
        <a
          href="/contact"
          className="inline-block bgPink hover:bgDark text-black font-bold py-3 px-6 rounded-full transition focus:outline focus:ring-2 focus:ring-pinkText shadow-[0_0_10px_#ec4899] animate-pulse"
        >
          {t('cta.button')}
        </a>
      </AnimatedSection>

      <AnimatedSection id="facebook">
        <div className="facebook-embed-container">
          <h1 className="text-2xl font-bold pinkText tilt-neon-font mb-2">Check out our Facebook!</h1>
          <p className="text-sm italic mx-auto">
            Will not load if privacy mode or ad blockers enabled.
          </p>
          <p className="text-sm italic mb-4">Click our name below to be redirected to Facebook</p>
          <FacebookEmbed />
        </div>
      </AnimatedSection>
    </main>
  )
}

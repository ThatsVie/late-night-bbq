'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

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
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white" id="main-content">
      {/* Hero */}
      <motion.section
        role="region"
        aria-labelledby="hero-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20"
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
        <p className="text-xl max-w-xl text-white/80">{t('hero.tagline')}</p>
      </motion.section>

      {/* How It Works */}
      <AnimatedSection id="how">
        <h2 id="how-heading" className="text-3xl font-bold text-pink-400 mb-6 font-family-bungee">
          {t('howItWorks.title')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('howItWorks.body')}</p>
      </AnimatedSection>

      {/* Our Story */}
      <AnimatedSection id="story">
        <h2 id="story-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('story.title')}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">{t('story.body')}</p>
      </AnimatedSection>

      {/* Menu Highlights */}
      <AnimatedSection id="menu">
        <h2 id="menu-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('menu.title')}
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-4xl mx-auto">
          {['item1', 'item2', 'item3'].map((itemKey) => (
            <motion.div
              key={itemKey}
              role="group"
              aria-labelledby={`item-${itemKey}-heading`}
              whileHover={{ scale: 1.05 }}
              className="bg-black p-6 rounded-xl border border-white/10 transition-all"
            >
              <h3 id={`item-${itemKey}-heading`} className="text-xl font-semibold mb-2">
                {t(`menu.items.${itemKey}.name`)}
              </h3>
              <p className="text-white/70">{t(`menu.items.${itemKey}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection id="cta">
        <h2 id="cta-heading" className="text-3xl font-bold text-pink-400 mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-white/80 mb-6">{t('cta.body')}</p>
        <a
          href="/contact"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-black font-bold py-3 px-6 rounded-full transition focus:outline focus:ring-2 focus:ring-pink-400 shadow-[0_0_10px_#ec4899] animate-pulse"
        >
          {t('cta.button')}
        </a>
      </AnimatedSection>
    </main>
  )
}

'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function BookingPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      {/* Intro */}
      <section className="text-center mb-12" aria-labelledby="booking-heading" role="region">
        <h1 id="booking-heading" className="text-4xl font-bold text-pink-500 mb-4">
          {t('booking.title')}
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">{t('booking.intro')}</p>
      </section>

      {/* Booking Form */}
      <section
        className="max-w-2xl mx-auto bg-zinc-900 p-6 sm:p-10 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="booking-form-heading"
        role="region"
      >
        <h2 id="booking-form-heading" className="sr-only">
          {t('booking.title')}
        </h2>

        <form className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm">
              {t('booking.fields.name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              {t('booking.fields.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-sm">
              {t('booking.fields.phone')}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(123) 456-7890"
              autoComplete="tel"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="details" className="block mb-2 text-sm">
              {t('booking.fields.details')}
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              placeholder={t('booking.placeholders.details')}
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <p className="text-xs text-white/60 italic">{t('booking.disclaimer')}</p>

          <button
            type="submit"
            disabled
            aria-disabled="true"
            className="w-full mt-6 bg-pink-500 text-black font-semibold py-3 rounded disabled:opacity-50 cursor-not-allowed"
          >
            {t('booking.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section
        className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="register-heading"
      >
        <h1 id="register-heading" className="text-3xl font-bold text-pink-500 mb-6">
          {t('register.title')}
        </h1>

        <form className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm">
              {t('register.fields.name')}
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
              {t('register.fields.email')}
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
              {t('register.fields.phone')}
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
            <label htmlFor="password" className="block mb-2 text-sm">
              {t('register.fields.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <button
            type="submit"
            disabled
            aria-disabled="true"
            className="w-full mt-4 bg-pink-500 text-black font-semibold py-3 rounded disabled:opacity-50 cursor-not-allowed"
          >
            {t('register.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

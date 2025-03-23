'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      <section
        className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="login-heading"
        role="region"
      >
        <h1 id="login-heading" className="text-3xl font-bold text-pink-500 mb-6">
          {t('login.title')}
        </h1>

        <form className="space-y-6" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              {t('login.fields.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm">
              {t('login.fields.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled
            aria-disabled="true"
            className="w-full mt-4 bg-pink-500 text-black font-semibold py-3 rounded disabled:opacity-50 cursor-not-allowed"
          >
            {t('login.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

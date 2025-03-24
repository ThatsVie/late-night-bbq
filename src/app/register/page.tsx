'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20">
      <section
        className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="register-heading"
        role="region"
      >
        <h1 id="register-heading" className="text-3xl font-bold text-pink-500 mb-6">
          {t('register.title')}
        </h1>

        <form className="space-y-6" noValidate>
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Password with toggle */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm">
              {t('register.fields.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full p-3 pr-10 rounded bg-black text-white border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
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

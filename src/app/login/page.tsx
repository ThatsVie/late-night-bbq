'use client'
export const dynamic = 'force-dynamic';

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      if (typeof window !== 'undefined') {
        router.push('/admin') // Redirect on success
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      <section
        className="w-full max-w-xl mx-auto bg-zinc-900 p-6 sm:p-8 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="login-heading"
        role="region"
      >
        <h1 id="login-heading" className="text-3xl font-bold text-pink-500 mb-6">
          {t('login.title')}
        </h1>

        <form className="space-y-6" onSubmit={handleLogin} noValidate>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              {t('login.fields.email')}
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm">
              {t('login.fields.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 rounded bg-black text-white border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-pink-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-pink-500 text-black font-semibold py-3 rounded"
          >
            {t('login.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

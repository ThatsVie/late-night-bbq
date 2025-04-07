'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-pink-500 mb-4">Page Not Found</h1>
      <p className="text-white/80 mb-6 text-center max-w-lg">
        Sorry, we couldn’t find the page you were looking for. Please check the URL or go back home.
      </p>
      <Link href="/" className="text-pink-400 underline hover:text-pink-300">
        Return to Homepage
        </Link>
    </main>
  )
}

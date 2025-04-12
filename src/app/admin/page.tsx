'use client'
export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col sm:flex-row">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden sm:block sm:w-64 bg-black border-r border-white/10 px-6 py-10">
        <h2 className="text-xl font-bold text-pink-500 mb-10">Admin Panel</h2>
        <nav className="space-y-4 text-sm">
          <Link href="/admin/banner" className="block hover:text-pink-400">
            Switch Homepage Banner
          </Link>
          <Link href="/admin/about" className="block hover:text-pink-400">
            Edit About Page
          </Link>
          <Link href="/admin/menu" className="block hover:text-pink-400">
            Manage Menu
          </Link>
          <Link href="/admin/merch" className="block hover:text-pink-400">
            Manage Merch
          </Link>
          <Link href="/admin/testimonials" className="block hover:text-pink-400">
            Manage Testimonials
          </Link>
          <Link href="#" className="block hover:text-pink-400">
            View Site Metrics
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          aria-label="Log out of admin panel"
          className="mt-10 text-sm text-white hover:bg-white/10 border border-white/20 px-4 py-2 rounded transition"
        >
          Log Out
        </button>
      </aside>

      {/* Main content area */}
      <section className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">Welcome, Admin</h1>
        <p className="text-white/80 mb-6">
          Use the menu to manage your site’s content.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: 'Banner',
              path: '/admin/banner',
              desc: 'Customize the homepage banner message and/or Call To Action.',
            },
            {
              label: 'About',
              path: '/admin/about',
              desc: 'Edit the Pitmaster story and image on the About page.',
            },
            {
              label: 'Menu',
              path: '/admin/menu',
              desc: 'Update food items, their descriptions, and images.',
            },
            {
              label: 'Merch',
              path: '/admin/merch',
              desc: 'Manage products in the merch store.',
            },
            {
              label: 'Testimonials',
              path: '/admin/testimonials',
              desc: 'Add, edit, or delete customer testimonials.',
            },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.path)}
              onKeyDown={(e) => e.key === 'Enter' && router.push(item.path)}
              tabIndex={0}
              role="button"
              className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
            >
              <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
              <p className="text-white/70">{item.desc}</p>
            </div>
          ))}

          <div
            className="bg-black p-6 rounded-lg border border-white/10 text-white/70"
            aria-disabled
          >
            <h2 className="text-lg font-semibold mb-2">Analytics</h2>
            <p>Track visits and engagement via Google Analytics. (Coming soon)</p>
          </div>
        </div>
      </section>
    </main>
  )
}

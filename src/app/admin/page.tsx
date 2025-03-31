'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-black border-r border-white/10 px-6 py-10">
        <h2 className="text-xl font-bold text-pink-500 mb-10">Admin Panel</h2>
        <nav className="space-y-4 text-sm">
          <a href="/admin/banner" className="block hover:text-pink-400">
            Switch Homepage Banner
          </a>
          <a href="/admin/about" className="block hover:text-pink-400">
            Edit About Page
          </a>
          <a href="/admin/menu" className="block hover:text-pink-400">
            Manage Menu
          </a>
          <a href="#" className="block hover:text-pink-400">
            Manage Merch
          </a>
          <a href="/admin/testimonials" className="block hover:text-pink-400">
            Manage Testimonials
          </a>
          <a href="#" className="block hover:text-pink-400">
            View Site Metrics
          </a>
        </nav>
        <button
          onClick={handleLogout}
          aria-label="Log out of admin panel"
          className="mt-10 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
        >
          Log Out
        </button>
      </aside>

      {/* Main content */}
      <section className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">Welcome, Admin</h1>
        <p className="text-white/80 mb-6">
          Use the menu to manage your site’s content and view traffic stats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Banner Card */}
          <div
            onClick={() => router.push('/admin/banner')}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/banner')}
            tabIndex={0}
            role="button"
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
          >
            <h2 className="text-lg font-semibold mb-2">Banner</h2>
            <p className="text-white/70">
              Customize the homepage banner message and/or Call To Action.
            </p>
          </div>

          {/* About Card */}
          <div
            onClick={() => router.push('/admin/about')}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/about')}
            tabIndex={0}
            role="button"
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
          >
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-white/70">Edit the Pitmaster story and image on the About page.</p>
          </div>

          {/* Menu Card */}
          <div
            onClick={() => router.push('/admin/menu')}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/menu')}
            tabIndex={0}
            role="button"
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
          >
            <h2 className="text-lg font-semibold mb-2">Menu</h2>
            <p className="text-white/70">Update food items, their descriptions, and images.</p>
          </div>

          {/* Merch Placeholder Card */}
          <div
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
            title="Coming Soon"
          >
            <h2 className="text-lg font-semibold mb-2">Merch</h2>
            <p className="text-white/70">Manage products in the merch store (coming soon).</p>
          </div>

          {/* Testimonials Card */}
          <div
            onClick={() => router.push('/admin/testimonials')}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/testimonials')}
            tabIndex={0}
            role="button"
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition outline-none focus:ring-2 focus:ring-pink-500"
          >
            <h2 className="text-lg font-semibold mb-2">Testimonials</h2>
            <p className="text-white/70">Add, edit, or delete customer testimonials.</p>
          </div>

          {/* Analytics Placeholder Card */}
          <div
            className="bg-black p-6 rounded-lg border border-white/10 hover:border-pink-500 hover:shadow-pink-500/10 cursor-pointer transition"
            role="button"
          >
            <h2 className="text-lg font-semibold mb-2">Analytics</h2>
            <p className="text-white/70">Track visits and engagement via Google Analytics.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

'use client'

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 px-6 py-10 hidden sm:block">
        <h2 className="text-xl font-bold text-pink-500 mb-10">Admin</h2>
        <nav className="space-y-4 text-sm">
          <a href="#" className="block hover:text-pink-400">Dashboard Overview</a>
          <a href="#" className="block hover:text-pink-400">Users</a>
          <a href="#" className="block hover:text-pink-400">Orders</a>
          <a href="#" className="block hover:text-pink-400">Reviews</a>
          <a href="#" className="block hover:text-pink-400">Metrics</a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">Welcome, Admin</h1>
        <p className="text-white/80">
          This is your dashboard overview. You’ll be able to view orders, manage users, and track
          key metrics here.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-black p-6 rounded-lg border border-white/10">
            <h2 className="text-lg font-semibold mb-2">Orders</h2>
            <p className="text-white/70">View and manage BBQ orders placed by customers.</p>
          </div>
          <div className="bg-black p-6 rounded-lg border border-white/10">
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <p className="text-white/70">See account activity and manage user roles.</p>
          </div>
          <div className="bg-black p-6 rounded-lg border border-white/10">
            <h2 className="text-lg font-semibold mb-2">Site Metrics</h2>
            <p className="text-white/70">Track traffic, bookings, and engagement.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

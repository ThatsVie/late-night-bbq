import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '../components/ClientLayout'

// Static metadata for SEO and favicons
export const metadata: Metadata = {
  title: 'Late Night BBQ',
  description: 'Houston’s favorite BBQ — now online!',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

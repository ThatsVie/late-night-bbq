import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '../components/ClientLayout'

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Late Night BBQ',
  description: 'Houston’s favorite BBQ — now online!',
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

'use client'

import '../i18n'
import { useEffect, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import Loader from './Loader'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRouteChange = (url: string) => {
    setLoading(true)
    startTransition(() => {
      router.push(url)
    })
  }

  useEffect(() => {
    if (!isPending) {
      setLoading(false)
    }
  }, [isPending])

  if (!mounted) return null

  return (
    <>
    {loading && <Loader />}
      <Navbar handleRouteChange={handleRouteChange} />
      <main>{children}</main>
      <Footer />
    </>
  )
}

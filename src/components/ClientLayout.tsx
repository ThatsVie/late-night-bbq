'use client'

import '../i18n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

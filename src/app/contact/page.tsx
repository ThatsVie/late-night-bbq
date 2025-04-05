'use client'

import { useTranslation } from 'react-i18next'
import Loader from '@/components/Loader'
import React, { useEffect, useState } from 'react'

export default function ContactPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // state for input fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
  })

  const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' | 'warning' | null}>({message: '', type: null})
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true);

    const incompleteFields = Object.keys(formData).filter((key) => {
      const typedKey = key as keyof typeof formData
      return formData[typedKey].trim() === ''
    })

    if (incompleteFields.length > 0) {
      setAlert({
        message:`Please complete the following fields: ${incompleteFields.join(', ')}`,
        type: 'warning',
      })
      setLoading(false);
      return
    }

    // validate email input
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex?.test(formData.email)) {
      setAlert({
        message: 'Please enter a valid email address',
        type: 'warning',
      })
      setLoading(false)
      return
    }

    //validate phone input
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setAlert({
        message: 'Please enter a valid phone number (e.g., 123-456-7890).',
        type: 'warning',
      })
      setLoading(false)
      return;
    }

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('response from server:', response)

      if (response.ok) {
        setAlert({
          message: 'Message sent successfully!',
          type: 'success',
        })
      } else {
        setAlert({
          message: 'Failed to send message, please double check information and resubmit',
          type: 'error',
        })
      }
    } catch {
      setAlert({
        message:'an unexpected error occured',
        type: 'error',
    })
  }
  setLoading(false)
}

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const closeAlert = () => {
    setAlert({ message: '', type: null })
  }

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      {/* Intro */}
      <section className="text-center mb-12" aria-labelledby="contact-heading" role="region">
        <h1 id="contact-heading" className="text-5xl font-bold pinkText neon-text tilt-neon-font mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">{t('contact.intro')}</p>
      </section>

      {/* custom alert message styling */}
      {alert.message && (
        <div
          className={`alert p-4 rounded-lg shadow-lg text-center text-sm ${
            alert.type === 'success'
            ? 'success'
            : alert.type === 'error'
            ? 'error'
            : alert.type === 'warning'
            ? 'warning'
            : ''
          }`}
          >
            <span>{alert.message}</span>
            <button onClick={closeAlert} className='close rounded-full'>
              &times;
            </button>
          </div>
      )}

      {/* Loader */}
      {loading && <Loader />}

      {/* Contact Form */}
      <section
        className="max-w-2xl mx-auto bg-zinc-900 p-6 sm:p-10 rounded-xl border border-white/10 shadow-lg"
        aria-labelledby="contact-form-heading"
        role="region"
      >
        <h2 id="contact-form-heading" className="sr-only">
          {t('contact.title')}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm">
              {t('contact.fields.name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              autoComplete="name"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              {t('contact.fields.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              autoComplete="email"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-sm">
              {t('contact.fields.phone')}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              autoComplete="tel"
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <div>
            <label htmlFor="details" className="block mb-2 text-sm">
              {t('contact.fields.details')}
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              value={formData.details}
              onChange={handleChange}
              placeholder={t('contact.placeholders.details')}
              className="w-full p-3 rounded bg-black text-white border border-white/10"
            />
          </div>

          <p className="text-xs text-white/60 italic">{t('contact.disclaimer')}</p>

          <button
            type="submit"
            className="w-full mt-6 bgPink text-black font-semibold py-3 rounded-4xl focus:outline-2 focus:outline-offset-2 focus:outline-pink-700"
            // disabled={submitDisabled}
          >
            {t('contact.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

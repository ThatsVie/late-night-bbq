'use client'

import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'


export default function ContactPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // state for input fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  })

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit triggered', formData);
    // console.log('Form submitted!');

    const incompleteFields = Object.keys(formData).filter((key) => {
      const typedKey = key as keyof typeof formData;
      return formData[typedKey].trim() === '';
    });



    if (incompleteFields.length > 0) {
      alert(`Please complete the following fields: ${incompleteFields.join(', ')}`);
      return;
    }

    try {
      const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    console.log('response from server:', response);

    if (response.ok) {
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message, please double check information and resubmit')
    }
  } catch (error) {
    console.error('error sending message', error);
    alert('an unexpected error occured');
  }
}

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-black text-white min-h-screen px-6 py-20" id="main-content">
      {/* Intro */}
      <section className="text-center mb-12" aria-labelledby="contact-heading" role="region">
        <h1 id="contact-heading" className="text-4xl font-bold text-pink-500 mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">{t('contact.intro')}</p>
      </section>

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
            className="w-full mt-6 bg-pink-500 text-black font-semibold py-3 rounded hover:bg-pink-700 focus:outline-2 focus:outline-offset-2 focus:outline-pink-700"
            // disabled={submitDisabled}
          >
            {t('contact.button')}
          </button>
        </form>
      </section>
    </main>
  )
}

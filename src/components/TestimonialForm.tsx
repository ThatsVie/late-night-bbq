
"use client"

import { useState, useEffect } from "react"

export default function TestimonialForm() {
  const [englishName, setEnglishName] = useState("")
  const [englishQuote, setEnglishQuote] = useState("")
  const [spanishName, setSpanishName] = useState("")
  const [spanishQuote, setSpanishQuote] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (englishQuote.trim()) {
        setIsTranslating(true)
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: englishQuote,
              targetLang: "es",
            }),
          })

          const data = await res.json()
          if (data.translatedText) {
            setSpanishQuote(data.translatedText)
          }
        } catch (err) {
          console.error("Translation failed:", err)
        } finally {
          setIsTranslating(false)
        }
      }
    }, 500) // debounce

    return () => clearTimeout(timeout)
  }, [englishQuote])

  return (
    <div className="text-white max-w-4xl mx-auto space-y-6">
      <h2 className="text-pink-400 text-2xl font-bold">Manage Testimonials</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-semibold text-pink-400">EN</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-black border border-white/20 rounded"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
          />
          <textarea
            placeholder="Quote"
            className="w-full p-2 mt-2 bg-black border border-white/20 rounded"
            value={englishQuote}
            onChange={(e) => setEnglishQuote(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-pink-400">ES</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-black border border-white/20 rounded"
            value={spanishName}
            onChange={(e) => setSpanishName(e.target.value)}
          />
          <textarea
            placeholder="Quote"
            className="w-full p-2 mt-2 bg-black border border-white/20 rounded"
            value={spanishQuote}
            onChange={(e) => setSpanishQuote(e.target.value)}
          />
        </div>
      </div>

      <button className="bg-pink-500 hover:bg-pink-600 text-black font-bold py-2 px-4 rounded">
        Add Testimonial
      </button>

      {isTranslating && <p className="text-sm italic text-white/60">Translating quote...</p>}
    </div>
  )
}

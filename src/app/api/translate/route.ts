// app/api/translate/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, targetLang } = body

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'text',
        }),
      }
    )

    const result = await response.json()
    const translated = result?.data?.translations?.[0]?.translatedText

    if (!translated) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
    }

    return NextResponse.json({ translatedText: translated })
  } catch (err) {
    console.error('Translation API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

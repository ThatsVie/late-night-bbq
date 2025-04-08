import { NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { locale, content, activeImage } = body
        if (!locale || !content || !activeImage) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const ref = doc(db, 'about', 'pitmaster')
        await setDoc(
            ref,
            {
                [locale]: { content },
                activeImage,
            },
            { merge: true }
        )
        return NextResponse.json({ message: 'about content updated' })
    } catch (err) {
        console.error('error updating about content', err)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
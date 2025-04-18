import { NextRequest, NextResponse } from "next/server";
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyAdminToken(req)
        if (!decodedToken) {
            return new NextResponse('Unauthorized', { status: 400 })
        }
        const body = await req.json()
        const { locale, content, activeImage } = body
        if (!locale || !content || !activeImage) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const ref = adminDb.collection('about').doc('pitmaster');
            await ref.set(
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
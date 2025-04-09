import { NextRequest, NextResponse } from "next/server";
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'


// Add new testimonial
export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyAdminToken(req)
        if (!decodedToken) {
            return new NextResponse('Unauthorized', { status: 400 })
        }
        const body = await req.json()
        const { en, es } = body;
        if (!en || !es || !en.name || !en.quote || !es.name || !es.quote) {
            return new NextResponse('Missing fields', { status: 400 });
        }
        await adminDb.collection('testimonials').add({ en, es});
        return NextResponse.json({ message: 'Testimonial added!' });
    } catch (err) {
        console.error('Error adding testimonial', err);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

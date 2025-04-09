import { NextRequest, NextResponse } from "next/server"
import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'

// extrat ID from dynamic route
function extractIdFromUrl(req: NextRequest): string | null {
    const segments = req.nextUrl.pathname.split('/')
    return segments[segments.length - 1] || null
}

// Update existing testimonial
export async function PUT(req: NextRequest) {
    const user = await verifyAdminToken(req)
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 })
    }

    const id = extractIdFromUrl(req)
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
    }

    try {
        const body = await req.json();
        const { en, es } = body;

        if (!en || !es || !en.name || !en.quote || !es.name || !es.quote) {
            return new NextResponse('Missing fields', { status: 400 });
        }
        
        await adminDb.collection('testimonials').doc(id).update({ en, es });
        return NextResponse.json({ message: "Testimonial updated" });
    } catch (err) {
        console.error('Error updating testimonial', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


// delete existing testimonial
export async function DELETE(req: NextRequest) {
    const user = await verifyAdminToken(req)
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 })
    }

    const id = extractIdFromUrl(req)
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing ID in URL' }), { status: 400 })
    }

    try {
        await adminDb.collection('testimonials').doc(id).delete();
        return Response.json({ success: true });
    } catch (err) {
        console.error('Error deleting testimonial:', err);
        return new Response(JSON.stringify({ error: 'Failed to delete testimonial'}), { status: 500 });
    }
}
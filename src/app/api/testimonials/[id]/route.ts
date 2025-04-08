import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import { db } from "@/firebase/config";

export async function PUT(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop()
    if (!id) {
        return NextResponse.json({ error: 'missing id in url '}, { status: 400})
    }
    const body = await req.json()

    await updateDoc(doc(db, 'testimonials', id), {
        'en.name': body.en.name,
        'en.quote': body.en.quote,
        'es.name': body.es.name,
        'es.quote': body.es.quote,
    })
    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop()
    if (!id) {
        return NextResponse.json({ error: 'missing id in URL'}, { status: 400 })
    }
    await deleteDoc(doc(db, 'testimonials', id))
    return NextResponse.json({ success: true })
}
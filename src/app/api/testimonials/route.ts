import { NextResponse } from "next/server";
import { getDocs, collection, addDoc} from "firebase/firestore";
import { db } from "@/firebase/config";

// Fetch all testimonials with Firestore IDs
export async function GET() {
    const snapshot = await getDocs(collection(db, 'testimonials'))
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    return NextResponse.json(data)
}

// Add new testimonial
export async function POST(req: Request) {
    const body = await req.json()
    await addDoc(collection(db, 'testimonials'), body)
    return NextResponse.json({ success: true })
}


import { NextResponse } from "next/server";
import { getDocs, collection, addDoc} from "firebase/firestore";
import { db } from "@/firebase/config";

export async function GET() {
    const snapshot = await getDocs(collection(db, 'testimonials'))
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const body = await req.json()
    await addDoc(collection(db, 'testimonials'), body)
    return NextResponse.json({ success: true })
}


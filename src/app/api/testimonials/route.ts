import { NextResponse } from "next/server";
import { getDocs, collection} from "firebase/firestore";
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


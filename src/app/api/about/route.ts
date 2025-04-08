import { NextResponse } from "next/server";
import { getDoc, doc} from "firebase/firestore";
import { db } from "@/firebase/config";

// Fetch about page details
export async function GET() {
    try {
        const snapshot = await getDoc(doc(db, 'about', 'pitmaster'));
        if (!snapshot.exists()) {
            return new NextResponse('About content not found', { status: 400 })     
        }
        const data = snapshot.data()
        return NextResponse.json({
            en: {
                content: data?.en?.content || '',
            },
            es: {
                content: data?.es?.content || '',
            },
            images: data?.images || [],
            activeImage: data?.activeImage || '',
        })
    } catch (err) {
        console.error('error fetching about content', err)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

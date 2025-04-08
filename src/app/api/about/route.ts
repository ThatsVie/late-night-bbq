import { NextResponse } from "next/server";
import { getDoc, doc} from "firebase/firestore";
import { db } from "@/firebase/config";

// Fetch about page details
export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const language = url.searchParams.get('lang') || 'en'
        console.log('fetching content for language:' , language)
        const snapshot = await getDoc(doc(db, 'about', 'pitmaster'))

        if (!snapshot.exists()) {
            return new NextResponse('About content not found', { status: 400 })     
        }
        const data = snapshot.data()
        const content = data?.[language]?.content || ''
        console.log('Fetched content:', content)
        
        return NextResponse.json({
            [language]: {
                content,
                activeImage: data?.activeImage || '',
            },
            images: data?.images || [],
            activeImage: data?.activeImage || '',
        })
    } catch (err) {
        console.error('error fetching about content', err)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

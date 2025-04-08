import { db } from '@/firebase/config'
import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'


export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        if (!file) {
            return new NextResponse('no file provided', { status:  400 })
        }
        const storage = getStorage()
        const uniqueName = `${uuidv4()}-${file.name}`
        const fileRef = ref(storage, `about/${uniqueName}`)
        const buffer = Buffer.from(await file.arrayBuffer())

        await uploadBytes(fileRef, buffer)
        const url = await getDownloadURL(fileRef)

        const docRef = doc(db, 'about', 'pitmaster')
        await updateDoc(docRef, {
            images: arrayUnion(url),
        })
        return NextResponse.json({ url })
    } catch (err) {
        console.error('POST error', err)
        return new NextResponse('Failed to upload image', { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const {activeImage} = await req.json()
        if (!activeImage) {
            return new NextResponse('Missing activeImage', { status: 400 })
        }
        
        const docRef = doc(db, 'about', 'pitmaster')
        await updateDoc(docRef, { activeImage })
        
        return NextResponse.json({ message: 'Active image updated' })
    } catch (err) {
        console.error('PUT error:', err)
        return new NextResponse('Failed to update active image', { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { url } = await req.json()
        if (!url) {
            return new NextResponse('Missing image URL', { status: 400 })
        }
        const docRef = doc(db, 'about', 'pitmaster')
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return new NextResponse('Document not found', { status: 404 })
        }
        const data = snap.data()
        const images: string[] = Array.isArray(data?.images) ? data.images : []

        const updatedImages = images.filter((img) => img !== url)
        const newActive = data.activeImage === url ? updatedImages[0] || '' : data.activeImage

        const storage = getStorage()
        const path = decodeURIComponent(new URL(url).pathname.split('/o/')[1])
        const fileRef = ref(storage, path)
        await deleteObject(fileRef)

        await updateDoc(docRef, {
            images: arrayRemove(url),
            activeImage: newActive,
        })

        return NextResponse.json({ message: 'Image deleted', activeImage: newActive })
    } catch (err) {
        console.error('DELETE error:', err)
        return new NextResponse('failed to delete image', { status: 500 })
    }
}
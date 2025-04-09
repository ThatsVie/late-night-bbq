import { adminDb } from '@/firebase/admin'
import { verifyAdminToken } from '@/utils/verifyAdmin'
import { NextResponse, NextRequest } from 'next/server'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await verifyAdminToken(req)
        if (!decodedToken) {
            return new NextResponse('Unauthorized', { status: 400 })
        }
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

        const docRef = adminDb.collection('about').doc('pitmaster')
        await docRef.update({
            images: FieldValue.arrayUnion(url),
        })
        return NextResponse.json({ url })
    } catch (err) {
        console.error('POST error', err)
        return new NextResponse('Failed to upload image', { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const decodedToken = await verifyAdminToken(req)
        if (!decodedToken) {
            return new NextResponse('Unauthorized', { status: 400 })
        }
        const {activeImage} = await req.json()
        if (!activeImage) {
            return new NextResponse('Missing activeImage', { status: 400 })
        }
        
        const docRef = adminDb.collection('about').doc('pitmaster')
        await docRef.update({ activeImage })
        
        return NextResponse.json({ message: 'Active image updated' })
    } catch (err) {
        console.error('PUT error:', err)
        return new NextResponse('Failed to update active image', { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decodedToken = await verifyAdminToken(req)
        if (!decodedToken) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        const { url } = await req.json()
        if (!url) {
            return new NextResponse('Missing image URL', { status: 400 })
        }
        const docRef = adminDb.collection('about').doc('pitmaster')
        const snap = await docRef.get()
        if (!snap.exists) {
            return new NextResponse('Document not found', { status: 404 })
        }
        const data = snap.data()
        if (!data) {
            return new NextResponse('Data not found in the document', { status: 404 })
        }
        const images: string[] = Array.isArray(data?.images) ? data.images : []

        const updatedImages = images.filter((img) => img !== url)
        const newActive = data.activeImage === url ? updatedImages[0] || '' : data.activeImage

        const storage = getStorage()
        const path = decodeURIComponent(new URL(url).pathname.split('/o/')[1])
        const fileRef = ref(storage, path)
        await deleteObject(fileRef)

        await docRef.update({
            images: FieldValue.arrayRemove(url),
            activeImage: newActive,
        })

        return NextResponse.json({ message: 'Image deleted', activeImage: newActive })
    } catch (err) {
        console.error('DELETE error:', err)
        return new NextResponse('failed to delete image', { status: 500 })
    }
}
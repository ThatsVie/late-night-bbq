import { db } from '@/firebase/config'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export interface AboutContent {
  content: string
  imageUrl: string
  images: string[]
  activeImage: string
}

export async function fetchAboutContent(locale: 'en' | 'es'): Promise<AboutContent | null> {
  const snap = await getDoc(doc(db, 'about', 'pitmaster'))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    content: data?.[locale]?.content || '',
    imageUrl: data?.imageUrl || '', 
    images: data?.images || [],
    activeImage: data?.activeImage || '',
  }
}

export async function updateAboutContent(
  locale: 'en' | 'es',
  content: string,
  activeImage: string
) {
  const ref = doc(db, 'about', 'pitmaster')
  await setDoc(
    ref,
    {
      [locale]: { content },
      activeImage,
    },
    { merge: true }
  )
}

export async function uploadPitmasterImage(file: File): Promise<string> {
  const storage = getStorage()
  const fileRef = ref(storage, `about/${file.name}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

export async function updatePitmasterImages(images: string[]) {
  const ref = doc(db, 'about', 'pitmaster')
  await updateDoc(ref, { images })
}

// Set the active image
export async function setActivePitmasterImage(imageUrl: string) {
  const ref = doc(db, 'about', 'pitmaster')
  await updateDoc(ref, { activeImage: imageUrl })
}

// Delete image from array & storage
export async function deletePitmasterImage(imageUrl: string) {
  const refDoc = doc(db, 'about', 'pitmaster')
  const snap = await getDoc(refDoc)
  if (!snap.exists()) return

  const data = snap.data()
  const images: string[] = data?.images || []
  const updatedImages = images.filter((url) => url !== imageUrl)
  const newActive = updatedImages[0] || ''

  // Remove from Firebase Storage
  const storage = getStorage()
  const path = decodeURIComponent(new URL(imageUrl).pathname.split('/o/')[1])
  const fileRef = ref(storage, path)
  await deleteObject(fileRef)

  // Update Firestore
  await updateDoc(refDoc, {
    images: updatedImages,
    activeImage: newActive,
  })
}

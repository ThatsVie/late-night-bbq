import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '@/firebase/config'
import { v4 as uuidv4 } from 'uuid'

export interface MerchLocale {
  title: string
  description: string
}

export interface MerchItemData {
  en: MerchLocale
  es: MerchLocale
  images: string[]
  activeImage: string
  order?: number
}

const merchCollection = collection(db, 'merchItems')

// Fetch all merch items
export async function fetchMerchItems(): Promise<(MerchItemData & { id: string })[]> {
  const snapshot = await getDocs(merchCollection)
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as MerchItemData & { id: string })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

// Add a new merch item
export async function addMerchItem(data: MerchItemData): Promise<void> {
  await addDoc(merchCollection, data)
}

// Update an existing merch item
export async function updateMerchItem(id: string, data: Partial<MerchItemData>): Promise<void> {
  await updateDoc(doc(merchCollection, id), data)
}

// Delete a merch item
export async function deleteMerchItem(id: string): Promise<void> {
  await deleteDoc(doc(merchCollection, id))
}

// Upload image and return its URL
export async function uploadMerchImage(file: File): Promise<string> {
  const storage = getStorage()
  const uniqueName = `${Date.now()}-${uuidv4()}-${file.name}`
  const fileRef = ref(storage, `merch/${uniqueName}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

// Update order of merch items in Firestore
export async function updateMerchOrder(items: (MerchItemData & { id: string })[]): Promise<void> {
  const batch = writeBatch(db)
  items.forEach((item, index) => {
    const ref = doc(merchCollection, item.id)
    batch.update(ref, { order: index })
  })
  await batch.commit()
}

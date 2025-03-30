import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '@/firebase/config'

export interface MenuLocale {
  title: string
  description: string
}

export interface MenuItemData {
  en: MenuLocale
  es: MenuLocale
  images: string[]
  activeImage: string
}

const collectionRef = collection(db, 'menuItems')

// Fetch all menu items
export async function fetchMenuItems(): Promise<(MenuItemData & { id: string })[]> {
  const snapshot = await getDocs(collectionRef)
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as MenuItemData & { id: string }
  )
}

// Add a new menu item
export async function addMenuItem(data: MenuItemData): Promise<void> {
  await addDoc(collectionRef, data)
}

// Update an existing item
export async function updateMenuItem(id: string, data: Partial<MenuItemData>): Promise<void> {
  await updateDoc(doc(collectionRef, id), data)
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(collectionRef, id))
}

// Upload image and return URL
export async function uploadMenuImage(file: File): Promise<string> {
  const storage = getStorage()
  const fileRef = ref(storage, `menu/${file.name}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

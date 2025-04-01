import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '@/firebase/config'
import { v4 as uuidv4 } from 'uuid'

export type MenuCategory = 'BBQ Meats' | 'Sides' | 'Fixins'

export interface MenuLocale {
  title: string
  description: string
}

export interface MenuItemData {
  category: MenuCategory
  en: MenuLocale
  es: MenuLocale
  images: string[]
  activeImage: string
  order: number
}

const collectionRef = collection(db, 'menuItems')

// Fetch all menu items, ordered by the order field
export async function fetchMenuItems(): Promise<(MenuItemData & { id: string })[]> {
  const q = query(collectionRef, orderBy('order'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as MenuItemData & { id: string }
  )
}

// Add a new menu item
export async function addMenuItem(data: MenuItemData): Promise<void> {
  await addDoc(collectionRef, data)
}

// Update an existing menu item
export async function updateMenuItem(id: string, data: Partial<MenuItemData>): Promise<void> {
  await updateDoc(doc(collectionRef, id), data)
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(collectionRef, id))
}

// Upload image and return its download URL
export async function uploadMenuImage(file: File): Promise<string> {
  const storage = getStorage()
  const uniqueName = `${uuidv4()}-${file.name}`
  const fileRef = ref(storage, `menu/${uniqueName}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

// Update the order of all menu items after drag and drop
export async function updateMenuOrder(items: (MenuItemData & { id: string })[]): Promise<void> {
  const batch = writeBatch(db)
  items.forEach((item, index) => {
    const itemRef = doc(collectionRef, item.id)
    batch.update(itemRef, { order: index })
  })
  await batch.commit()
}

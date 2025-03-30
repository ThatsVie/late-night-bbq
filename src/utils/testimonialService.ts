import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'

export interface TestimonialLocale {
  name: string
  quote: string
}

export interface TestimonialData {
  en: TestimonialLocale
  es: TestimonialLocale
}

// Fetch all testimonials with Firestore IDs
export async function fetchAllTestimonials(): Promise<(TestimonialData & { id: string })[]> {
  const snapshot = await getDocs(collection(db, 'testimonials'))
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as TestimonialData & { id: string }
  )
}

// Add new testimonial
export async function addTestimonial(data: TestimonialData): Promise<void> {
  await addDoc(collection(db, 'testimonials'), data)
}

// Update existing testimonial (flattened for Firestore)
export async function updateTestimonial(id: string, data: TestimonialData): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id), {
    'en.name': data.en.name,
    'en.quote': data.en.quote,
    'es.name': data.es.name,
    'es.quote': data.es.quote,
  })
}

// Delete testimonial by ID
export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id))
}

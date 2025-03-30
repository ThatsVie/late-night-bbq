import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'

export async function fetchTestimonials(locale: 'en' | 'es') {
  const snapshot = await getDocs(collection(db, 'testimonials'))
  return snapshot.docs.map((doc) => doc.data()[locale])
}

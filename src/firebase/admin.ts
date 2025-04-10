import { initializeApp, cert, getApps, App } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!privateKey) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY in environment')
}

const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

export const adminApp: App =
  getApps().length === 0 ? initializeApp(adminConfig) : getApps()[0]

export const adminStorage = getStorage(adminApp)
export const adminDb = getFirestore(adminApp)

import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/firebase/admin'
import { NextRequest } from 'next/server'

export async function verifyAdminToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]

  try {
    const decodedToken = await getAuth(adminApp).verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Invalid Firebase token:', error)
    return null
  }
}

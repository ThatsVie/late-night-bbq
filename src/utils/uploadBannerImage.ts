import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadBannerImage(file: File): Promise<string> {
  const storage = getStorage()
  const storageRef = ref(storage, `banners/${file.name}`)

  // Upload the file
  await uploadBytes(storageRef, file)

  // Get the download URL to store in Firestore
  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}

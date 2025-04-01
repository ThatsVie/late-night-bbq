'use client'

import { useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage'

interface CropRectModalProps {
  imageSrc: string
  onClose: () => void
  onCropComplete: (croppedFile: File) => void
}

export default function CropRectModal({ imageSrc, onClose, onCropComplete }: CropRectModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  const handleCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (!croppedBlob) throw new Error('Invalid crop result')

      const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' })
      onCropComplete(croppedFile)
      onClose()
    } catch (e) {
      console.error('Crop failed:', e)
      alert('Cropping failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full max-w-2xl h-[400px] bg-zinc-900 rounded-lg overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={2 / 1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-black font-bold rounded"
          >
            Confirm Crop
          </button>
        </div>
      </div>
    </div>
  )
}

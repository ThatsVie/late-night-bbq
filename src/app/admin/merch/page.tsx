'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CropRectModal from '@/components/CropRectModal'
import { getAuth } from 'firebase/auth'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export interface MerchLocale {
  title: string
  description: string
}

export interface MerchItemData {
  en: MerchLocale
  es: MerchLocale
  images: string[]
  activeImage: string
  order: number
}

export default function ManageMerchPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement | null>(null)
  const [items, setItems] = useState<(MerchItemData & { id: string })[]>([])
  const [formState, setFormState] = useState<MerchItemData>({
    en: { title: '', description: '' },
    es: { title: '', description: '' },
    images: [],
    activeImage: '',
    order: 0,
  })
  const [file, setFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)

  const autoTranslate = async (text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: 'es' }),
      })
      const data = await res.json()
      return data.translatedText
    } catch (err) {
      console.error('Translation error:', err)
      return ''
    }
  }

  const handleMerchInputChange = async (
    lang: 'en' | 'es',
    field: 'title' | 'description',
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }))

    if (lang === 'en') {
      clearTimeout((window as any)._merchTranslateTimeout)
      ;(window as any)._merchTranslateTimeout = setTimeout(async () => {
        if (!value.trim()) return
        const translated = await autoTranslate(value)
        setFormState((prev) => ({
          ...prev,
          es: {
            ...prev.es,
            [field]: translated,
          },
        }))
      }, 500)
    }
  }

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/merch')
      const data = await res.json()
      setItems(data)
    }
    load()
  }, [])

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setShowCropModal(true)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreview(null)
    }
  }, [file])

  const uploadMerchImage = async (file: File): Promise<string> => {
    const user = getAuth().currentUser
    if (!user) throw new Error('User not authenticated')
    const token = await user.getIdToken()

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/merch/upload-image', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Image upload failed')
    const { url } = await res.json()
    return url
  }

  const handleCropComplete = async (cropped: File) => {
    setCroppedFile(cropped)
    const objectUrl = URL.createObjectURL(cropped)
    setPreview(objectUrl)
    setShowCropModal(false)
  }

  const handleSubmit = async () => {
    const hasContent =
      formState.en.title &&
      formState.en.description &&
      formState.es.title &&
      formState.es.description

    if (!hasContent) return alert('Please complete all fields.')

    const user = getAuth().currentUser
    if (!user) return alert('User not authenticated')
    const token = await user.getIdToken()

    let imageUrl = ''
    if (croppedFile) {
      try {
        imageUrl = await uploadMerchImage(croppedFile)
      } catch (err) {
        console.error(err)
        return alert('Image upload failed')
      }
    }

    const updatedImages = [...formState.images, ...(imageUrl ? [imageUrl] : [])]
    const updatedForm = {
      ...formState,
      images: updatedImages,
      activeImage: updatedImages[0] || formState.activeImage,
    }

    if (!updatedForm.activeImage) return alert('Please add and crop at least one image.')

    const endpoint = editingId ? `/api/admin/merch/${editingId}` : '/api/admin/merch'
    const method = editingId ? 'PATCH' : 'POST'

    if (!editingId) {
      updatedForm.order = items.length
    }

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedForm),
    })

    if (!res.ok) return alert('Failed to save item')

    const refreshed = await fetch('/api/merch')
    const newData = await refreshed.json()
    setItems(newData)
    setFormState({ en: { title: '', description: '' }, es: { title: '', description: '' }, images: [], activeImage: '', order: 0 })
    setCroppedFile(null)
    setFile(null)
    setPreview(null)
    setEditingId(null)
  }

  const handleEdit = (item: MerchItemData & { id: string }) => {
    setFormState(item)
    setEditingId(item.id)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const user = getAuth().currentUser
    if (!user) return alert('User not authenticated')
    const token = await user.getIdToken()
    await fetch(`/api/admin/merch/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    const refreshed = await fetch('/api/merch')
    const newData = await refreshed.json()
    setItems(newData)
  }

  const handleSetActiveImage = async (id: string, url: string) => {
    const user = getAuth().currentUser
    if (!user) return alert('User not authenticated')
    const token = await user.getIdToken()

    await fetch(`/api/admin/merch/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activeImage: url }),
    })

    const refreshed = await fetch('/api/merch')
    const newData = await refreshed.json()
    setItems(newData)
  }

  const handleDeleteImage = async (id: string, url: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const user = getAuth().currentUser
    if (!user) return alert('User not authenticated')
    const token = await user.getIdToken()

    const updated = {
      ...item,
      images: item.images.filter(i => i !== url),
      activeImage: item.images[0] === url ? item.images[1] || '' : item.activeImage,
    }

    await fetch(`/api/admin/merch/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    })

    const refreshed = await fetch('/api/merch')
    const newData = await refreshed.json()
    setItems(newData)
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    const updated = reordered.map((item, idx) => ({ id: item.id, order: idx }))

    const user = getAuth().currentUser
    if (!user) return alert('User not authenticated')
    const token = await user.getIdToken()

    await fetch('/api/admin/merch/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    })

    const refreshed = await fetch('/api/merch')
    const newData = await refreshed.json()
    setItems(newData)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Manage Merch</h1>

      <button
        onClick={() => router.push('/admin')}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Admin Dashboard
      </button>

      <section ref={formRef} className="mb-10 bg-black p-6 rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Merch Item</h2>

        {preview && (
          <div className="mt-4">
            <p className="text-sm text-white/60 mb-2">Cropped Image Preview:</p>
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={200}
              className="rounded border border-white/10"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium text-white/80">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-black hover:file:bg-pink-600"
          />
        </div>

        {['en', 'es'].map((lang) => (
          <div key={lang} className="mb-4">
            <h3 className="text-pink-400 font-medium mb-1 uppercase">{lang}</h3>
            <input
              className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded"
              maxLength={100}
              required
              placeholder={`Title (${lang})`}
              value={formState[lang as 'en' | 'es'].title}
              onChange={(e) =>
                handleMerchInputChange(lang as 'en' | 'es', 'title', e.target.value)
              }
            />
            <textarea
              className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded max-h-32"
              maxLength={300}
              required
              placeholder={`Description (${lang})`}
              value={formState[lang as 'en' | 'es'].description}
              onChange={(e) =>
                handleMerchInputChange(lang as 'en' | 'es', 'description', e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-pink-500 text-black font-bold py-2 px-4 rounded hover:bg-pink-600 mt-4"
        >
          {editingId ? 'Update' : 'Add'} Item
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Current Merch Items</h2>
        <p className="text-white/60 text-sm mb-2">
          Click and drag items to rearrange the order they'll appear on the merch page.
        </p>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="merch-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-black p-4 rounded-lg border border-white/10 relative"
                      >
                        {item.activeImage && (
                          <Image
                            src={item.activeImage}
                            alt={item.en.title}
                            width={600}
                            height={300}
                            className="rounded mb-3 w-full h-48 object-cover"
                          />
                        )}
                        <h3 className="text-pink-400 font-bold text-lg mb-1">{item.en.title}</h3>
                        <p className="text-white/80 text-sm mb-4">{item.en.description}</p>

                        {item.images.length > 1 && (
                          <div className="space-y-2 mb-4">
                            <p className="text-white/60 text-sm">Select active image:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.images.map((url) => (
                                <div key={url} className="relative group">
                                  <Image
                                    src={url}
                                    alt="merch option"
                                    width={80}
                                    height={80}
                                    className={`rounded border ${url === item.activeImage ? 'border-pink-500' : 'border-white/20'}`}
                                    onClick={() => handleSetActiveImage(item.id, url)}
                                  />
                                  <button
                                    onClick={() => handleDeleteImage(item.id, url)}
                                    className="absolute -top-1 -right-1 bg-red-600 text-xs text-white px-1 rounded hidden group-hover:block"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-sm text-pink-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-sm text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      {showCropModal && preview && (
        <CropRectModal
          imageSrc={preview}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </main>
  )
}

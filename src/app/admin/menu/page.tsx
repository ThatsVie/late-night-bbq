"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getAuth } from 'firebase/auth'
import CropRectModal from '@/components/CropRectModal'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export type MenuCategory = 'BBQ Meats' | 'Sides' | 'Fixins'
export interface MenuLocale {
  title: string
  description: string
}
export interface MenuItemData {
  id: string
  category: MenuCategory
  en: MenuLocale
  es: MenuLocale
  images: string[]
  activeImage: string
  order: number
}

const CATEGORIES: MenuCategory[] = ['BBQ Meats', 'Sides', 'Fixins']

export default function ManageMenuPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement | null>(null)
  const [items, setItems] = useState<MenuItemData[]>([])
  const [formState, setFormState] = useState<Omit<MenuItemData, 'id'>>({
    en: { title: '', description: '' },
    es: { title: '', description: '' },
    images: [],
    activeImage: '',
    category: 'BBQ Meats',
    order: 0,
  })
  const [file, setFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const load = async () => {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setItems(data)
    }
    load()
  }, [mounted])

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setShowCropModal(true)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const getAdminToken = async () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('User not authenticated')
    return user.getIdToken()
  }

  const uploadMenuImage = async (file: File) => {
    const token = await getAdminToken()
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/menu/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { url } = await res.json()
    return url
  }

  const handleCropComplete = async (cropped: File) => {
    setCroppedFile(cropped)
    const objectUrl = URL.createObjectURL(cropped)
    setPreview(objectUrl)
    setShowCropModal(false)
  }

  const handleFileChange = (incomingFile: File | null) => {
    if (!incomingFile) return
    setFile(incomingFile)
  }

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

  const handleInputChange = async (
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
      clearTimeout((window as any)._menuTranslateTimeout)
      ;(window as any)._menuTranslateTimeout = setTimeout(async () => {
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

  const handleEdit = (item: MenuItemData) => {
    const { id, ...rest } = item
    setFormState(rest)
    setEditingId(id)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  const handleSubmit = async () => {
    const hasContent =
      formState.en.title &&
      formState.es.title &&
      formState.en.description &&
      formState.es.description

    if (!hasContent) return alert('Please complete all fields.')

    const token = await getAdminToken()

    let imageUrl = ''
    if (croppedFile) {
      try {
        imageUrl = await uploadMenuImage(croppedFile)
      } catch (error) {
        console.error('Upload error:', error)
        return alert('Image upload failed. Please try again.')
      }
    }

    const updatedImages = [...formState.images, ...(imageUrl ? [imageUrl] : [])]
    const updatedForm = {
      ...formState,
      images: updatedImages,
      activeImage: updatedImages[0] || formState.activeImage,
    }

    if (!updatedForm.activeImage) return alert('Please add and crop at least one image.')

    const endpoint = editingId ? `/api/admin/menu/${editingId}` : '/api/admin/menu'
    const method = editingId ? 'PATCH' : 'POST'

    if (!editingId) {
      updatedForm.order = items.filter((i) => i.category === formState.category).length
    }

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedForm),
    })

    if (!res.ok) {
      const errData = await res.json()
      console.error('Menu submit error:', errData)
      alert(errData.error || 'Failed to submit menu item.')
      return
    }

    const updated = await (await fetch('/api/menu')).json()
    setItems(updated)
    setFormState({
      en: { title: '', description: '' },
      es: { title: '', description: '' },
      images: [],
      activeImage: '',
      category: 'BBQ Meats',
      order: 0,
    })
    setCroppedFile(null)
    setFile(null)
    setPreview(null)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const token = await getAdminToken()
    await fetch(`/api/admin/menu/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const res = await fetch('/api/menu')
    const updated = await res.json()
    setItems(updated)
  }

  const handleDeleteImage = async (itemId: string, imageUrl: string) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return
    const filtered = item.images.filter((url) => url !== imageUrl)
    const updated = {
      ...item,
      images: filtered,
      activeImage: filtered[0] || '',
    }
    const token = await getAdminToken()
    await fetch(`/api/admin/menu/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    })
    const res = await fetch('/api/menu')
    const refreshed = await res.json()
    setItems(refreshed)
  }

  const handleSetActiveImage = async (id: string, url: string) => {
    const token = await getAdminToken()
    await fetch(`/api/admin/menu/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activeImage: url }),
    })
    const res = await fetch('/api/menu')
    const updated = await res.json()
    setItems(updated)
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const fromIndex = result.source.index
    const toIndex = result.destination.index
    const draggedId = result.draggableId

    const draggedItem = items.find((i) => i.id === draggedId)
    if (!draggedItem) return

    const categoryItems = items.filter((i) => i.category === draggedItem.category)
    const otherItems = items.filter((i) => i.category !== draggedItem.category)

    const reordered = Array.from(categoryItems)
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    const updatedWithOrder = reordered.map((item, index) => ({ ...item, order: index }))
    const merged = [...otherItems, ...updatedWithOrder]
    setItems(merged)

    const token = await getAdminToken()
    await fetch('/api/admin/menu/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedWithOrder.map(({ id, order }) => ({ id, order }))),
    })
  }

  if (!mounted) return null
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-6">
        <h1 className="text-2xl font-bold text-pink-500 mb-6">Manage Menu</h1>

        <button
          onClick={() => router.push('/admin')}
          className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
        >
          ← Back to Admin Dashboard
        </button>

        <section ref={formRef} className="mb-10 bg-black p-6 rounded-lg border border-white/10">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Menu Item</h2>

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
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-black hover:file:bg-pink-600"
            />
          </div>

          <label className="block text-white/70 text-sm mb-2">Category</label>
          <select
            className="mb-4 w-full bg-zinc-900 border border-white/20 p-2 rounded text-white"
            value={formState.category}
            onChange={(e) => setFormState({ ...formState, category: e.target.value as MenuCategory })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {['en', 'es'].map((lang) => (
            <div key={lang} className="mb-4">
              <h3 className="text-pink-400 font-medium mb-1 uppercase">{lang}</h3>
              <input
                className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded"
                maxLength={100}
                required
                placeholder={`Title (${lang})`}
                value={formState[lang as 'en' | 'es'].title}
                onChange={(e) => handleInputChange(lang as 'en' | 'es', 'title', e.target.value)}
              />
              <textarea
                className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded max-h-32"
                maxLength={300}
                required
                placeholder={`Description (${lang})`}
                value={formState[lang as 'en' | 'es'].description}
                onChange={(e) => handleInputChange(lang as 'en' | 'es', 'description', e.target.value)}
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
      {/* Renders Categories */}
      {CATEGORIES.map((category) => (
        <section key={category} className="mb-10">
          <h2 className="text-xl font-bold text-pink-400 mb-4">{category}</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`menu-${category}`}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {items
                    .filter((item) => item.category === category)
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
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
                            <h3 className="text-pink-400 font-bold text-lg mb-1">
                              {item.en.title}
                            </h3>
                            <p className="text-white/80 text-sm mb-4">{item.en.description}</p>

                            {item.images.length > 1 && (
                              <div className="space-y-2 mb-4">
                                <p className="text-white/60 text-sm">Select active image:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.images.map((url) => (
                                    <div key={url} className="relative group">
                                      <Image
                                        src={url}
                                        alt="menu option"
                                        width={80}
                                        height={80}
                                        className={`rounded border ${
                                          url === item.activeImage
                                            ? 'border-pink-500'
                                            : 'border-white/20'
                                        }`}
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

                            <div className="flex gap-2">
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
      ))}

      {showCropModal && preview && (
        <CropRectModal
          imageSrc={preview}
          onClose={() => {
            if (preview) URL.revokeObjectURL(preview)
            setShowCropModal(false)
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </main>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CropRectModal from '@/components/CropRectModal'
import {
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
  updateMenuOrder,
  MenuItemData,
  MenuCategory,
} from '@/utils/menuService'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

const CATEGORIES: MenuCategory[] = ['BBQ Meats', 'Sides', 'Fixins']

export default function ManageMenuPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement | null>(null)
  const [items, setItems] = useState<(MenuItemData & { id: string })[]>([])
  const [formState, setFormState] = useState<MenuItemData>({
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

  useEffect(() => {
    const load = async () => {
      const data = await fetchMenuItems()
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
    }
  }, [file])

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

  const handleSubmit = async () => {
    const hasContent =
      formState.en.title &&
      formState.es.title &&
      formState.en.description &&
      formState.es.description

    if (!hasContent) return alert('Please complete all fields.')

    let imageUrl = ''
    if (croppedFile) {
      imageUrl = await uploadMenuImage(croppedFile)
    }

    const updatedImages = [...formState.images, ...(imageUrl ? [imageUrl] : [])]
    const updatedForm = {
      ...formState,
      images: updatedImages,
      activeImage: updatedImages[0] || formState.activeImage,
    }

    if (!updatedForm.activeImage) return alert('Please add and crop at least one image.')

    if (editingId) {
      await updateMenuItem(editingId, updatedForm)
    } else {
      updatedForm.order = items.filter((i) => i.category === formState.category).length
      await addMenuItem(updatedForm)
    }

    const updated = await fetchMenuItems()
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

  const handleEdit = (item: MenuItemData & { id: string }) => {
    setFormState(item)
    setEditingId(item.id)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    await deleteMenuItem(id)
    const updated = await fetchMenuItems()
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
    await updateMenuItem(itemId, updated)
    const refreshed = await fetchMenuItems()
    setItems(refreshed)
  }

  const handleSetActiveImage = async (id: string, url: string) => {
    await updateMenuItem(id, { activeImage: url })
    const updated = await fetchMenuItems()
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
    await updateMenuOrder(updatedWithOrder)
  }

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
        <p className="text-white/60 text-sm mb-4">
          Start by uploading an image—this will open the cropping tool. After cropping, fill out the
          item name and description in both English and Spanish. Then, select the appropriate
          category. Once saved, you can return to this item to upload additional images, change the
          active image, or edit its content. Drag and drop items within each category to reorder how
          they appear on the site.
        </p>

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
            id="image-upload"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="inline-block bg-white/10 text-white px-4 py-2 rounded cursor-pointer hover:bg-white/20"
          >
            Choose Image
          </label>
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
              onChange={(e) =>
                setFormState({
                  ...formState,
                  [lang]: {
                    ...formState[lang as 'en' | 'es'],
                    title: e.target.value,
                  },
                })
              }
            />
            <textarea
              className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded max-h-32"
              maxLength={300}
              required
              placeholder={`Description (${lang})`}
              value={formState[lang as 'en' | 'es'].description}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  [lang]: {
                    ...formState[lang as 'en' | 'es'],
                    description: e.target.value,
                  },
                })
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

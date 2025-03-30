'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
  MenuItemData,
} from '@/utils/menuService'

export default function ManageMenuPage() {
  const router = useRouter()
  const [items, setItems] = useState<(MenuItemData & { id: string })[]>([])
  const [formState, setFormState] = useState<MenuItemData>({
    en: { title: '', description: '' },
    es: { title: '', description: '' },
    images: [],
    activeImage: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

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
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreview(null)
    }
  }, [file])

  const handleSubmit = async () => {
    let data = { ...formState }

    if (file) {
      const url = await uploadMenuImage(file)
      const updatedImages = [...formState.images, url]
      data = {
        ...formState,
        images: updatedImages,
        activeImage: updatedImages[0],
      }
    }

    if (editingId) {
      await updateMenuItem(editingId, data)
    } else {
      await addMenuItem(data)
    }

    const updated = await fetchMenuItems()
    setItems(updated)
    setFormState({
      en: { title: '', description: '' },
      es: { title: '', description: '' },
      images: [],
      activeImage: '',
    })
    setFile(null)
    setPreview(null)
    setEditingId(null)
  }

  const handleEdit = (item: MenuItemData & { id: string }) => {
    setFormState(item)
    setEditingId(item.id)
  }

  const handleDelete = async (id: string) => {
    await deleteMenuItem(id)
    const updated = await fetchMenuItems()
    setItems(updated)
  }

  const handleSetActiveImage = async (id: string, imageUrl: string) => {
    await updateMenuItem(id, { activeImage: imageUrl })
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Manage Menu</h1>

      <button
        onClick={() => router.push('/admin')}
        className="mb-6 text-sm text-white hover:text-pink-400 border border-white/20 px-4 py-2 rounded"
      >
        ← Back to Admin Dashboard
      </button>

      <section className="mb-10 bg-black p-6 rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Menu Item</h2>
        <p className="text-white/60 text-sm mb-4">
          Fill out the title and description for this menu item in both English and Spanish. You can
          upload <strong>one image at a time</strong>. After saving, you can return to this item,
          click <em>Edit</em>, and upload additional images. Once multiple images are uploaded,
          you’ll be able to select which one should be displayed as the active image or remove any
          you no longer need.
        </p>

        {['en', 'es'].map((lang) => (
          <div key={lang} className="mb-4">
            <h3 className="text-pink-400 font-medium mb-1 uppercase">{lang}</h3>
            <input
              className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded"
              placeholder={`Title (${lang})`}
              value={formState[lang as 'en' | 'es'].title}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  [lang]: {
                    ...prev[lang as 'en' | 'es'],
                    title: e.target.value,
                  },
                }))
              }
            />
            <textarea
              className="w-full p-2 mb-2 bg-zinc-900 border border-white/20 rounded"
              placeholder={`Description (${lang})`}
              value={formState[lang as 'en' | 'es'].description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  [lang]: {
                    ...prev[lang as 'en' | 'es'],
                    description: e.target.value,
                  },
                }))
              }
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-2 font-medium text-white/80">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="inline-block bg-white/10 text-white px-4 py-2 rounded cursor-pointer hover:bg-white/20"
          >
            Choose Image
          </label>
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-white/60 mb-2">Image Preview:</p>
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={200}
                className="rounded border border-white/10"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-pink-500 text-black font-bold py-2 px-4 rounded hover:bg-pink-600 mt-4"
        >
          {editingId ? 'Update' : 'Add'} Item
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Current Menu Items</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-black p-4 rounded-lg border border-white/10">
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
          ))}
        </div>
      </section>
    </main>
  )
}

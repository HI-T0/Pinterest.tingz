import React from 'react'
import { X } from 'lucide-react'
import { Product } from '../types'

interface EditProductModalProps {
  product: Product
  onSave: (updatedProduct: Product) => void
  onClose: () => void
}

export default function EditProductModal({ product, onSave, onClose }: EditProductModalProps) {
  const [editedProduct, setEditedProduct] = React.useState(product)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProduct(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedProduct)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-600">Edit Product</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (KSh)
            </label>
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}


import React, { useState } from 'react'
import { X } from 'lucide-react'

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  likes: number;
  image: string;
}

interface AddProductModalProps {
  onClose: () => void
  onAddProduct: (product: Omit<Product, 'id'>) => void
}

export default function AddProductModal({ onClose, onAddProduct }: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: '',
    likes: 0,
    image: '/placeholder.svg?height=400&width=400'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'likes' ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddProduct(newProduct)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-600">Add New Product</h2>
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
              value={newProduct.name}
              onChange={handleChange}
              required
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
              value={newProduct.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="tote">Tote</option>
              <option value="jewelry">Jewelry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Likes
            </label>
            <input
              type="number"
              name="likes"
              value={newProduct.likes}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}


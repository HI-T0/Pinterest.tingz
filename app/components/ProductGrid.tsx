import React from 'react'
import Image from 'next/image'
import { Edit2, Plus } from 'lucide-react'
import { Product } from '../types'

interface ProductGridProps {
  products: Product[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  addToCart: (product: Product) => void
  isAdmin: boolean
  onEditProduct: (product: Product) => void
  onAddProduct: () => void
}

export default function ProductGrid({
  products,
  selectedCategory,
  setSelectedCategory,
  addToCart,
  isAdmin,
  onEditProduct,
  onAddProduct
}: ProductGridProps) {
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} Ksh`
  }

  return (
    <>
      <div className="mb-8 flex gap-4 justify-center items-center">
        {['all', 'tote', 'jewelry'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category 
                ? 'bg-pink-500 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-pink-100'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={onAddProduct}
            className="px-6 py-2 rounded-full font-medium transition-all bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <Image
                src={product.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-64 object-cover"
              />
              {isAdmin && (
                <button
                  onClick={() => onEditProduct(product)}
                  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-blue-50"
                >
                  <Edit2 className="text-blue-500" size={20} />
                </button>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              </div>
              <p className="text-gray-500 mb-2">{product.description}</p>
              <p className="text-pink-600 font-bold text-xl mb-4">{formatPrice(product.price)}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                Add to Cart ✨
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}



'use client'

import React, { useState, useEffect } from 'react'
import Header from './Header'
import ProductGrid from './ProductGrid'
import CartModal from './CartModal'
import EditProductModal from './EditProductModal'
import LandingPage from './LandingPage'
import AddProductModal from './AddProductModal'
import LoadingBar from './LoadingBar'
import { Product, CartItem } from '../types'

export default function ShoppingWebsite() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        setIsAdmin(data.isAdmin)
      } else {
        throw new Error(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError('Authentication failed. Please try again.')
    }
  }

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setProducts(prevProducts =>
          prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        )
        setEditingProduct(null)
      } else {
        throw new Error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      setError('Failed to update product. Please try again.')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId))
        setEditingProduct(null)
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
      } else {
        throw new Error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product. Please try again.')
    }
  }

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setProducts(prevProducts => [...prevProducts, data.product])
        setShowAddProduct(false)
      } else {
        throw new Error(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      setError('Failed to add product. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return <LandingPage onEmailSubmit={handleEmailSubmit} />
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {isLoading && <LoadingBar />}
      <Header 
        cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addToCart={addToCart}
          isAdmin={isAdmin}
          onEditProduct={handleEditProduct}
          onAddProduct={() => setShowAddProduct(true)}
        />
      </main>
      {showCart && (
        <CartModal
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onAddProduct={handleAddProduct}
        />
      )}
    </div>
  )
}



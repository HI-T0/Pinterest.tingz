import React, { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { CartItem } from '../types'
import OrderConfirmationModal from './OrderConfirmationModal'

interface CartModalProps {
  cartItems: CartItem[]
  onClose: () => void
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, newQuantity: number) => void
}

export default function CartModal({
  cartItems,
  onClose,
  onRemoveItem,
  onUpdateQuantity
}: CartModalProps) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} Ksh`
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    setShowPaymentInfo(true)
  }

  const handlePaymentComplete = () => {
    setShowPaymentInfo(false)
    setShowOrderConfirmation(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600">Your Cart ✨</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" size={24} />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-pink-600 font-bold">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-pink-600">{formatPrice(getTotalPrice())}</span>
              </div>
              {!showPaymentInfo ? (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                >
                  Proceed to Checkout ✨
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">Please send your payment to the following Mpesa number:</p>
                  <p className="text-2xl font-bold text-center">0712 345 678</p>
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    I have Completed the Payment
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {showOrderConfirmation && (
        <OrderConfirmationModal
          cartItems={cartItems}
          onClose={() => {
            setShowOrderConfirmation(false)
            onClose()
          }}
        />
      )}
    </div>
  )
}


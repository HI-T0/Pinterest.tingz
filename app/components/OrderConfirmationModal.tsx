import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CartItem } from '../types'
import emailjs from '@emailjs/browser'

interface OrderConfirmationModalProps {
  cartItems: CartItem[]
  onClose: () => void
}

export default function OrderConfirmationModal({ cartItems, onClose }: OrderConfirmationModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentCode, setPaymentCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const orderDetails = cartItems.map(item => 
      `${item.name} - Quantity: ${item.quantity}, Price: ${item.price} KSh`
    ).join('\n')

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
      const templateParams = {
        to_email: 'Mish',
        from_name: name,
        from_email: email,
        phone: phone,
        payment_code: paymentCode,
        order_details: orderDetails,
        total_price: `${total} KSh`,
      }

      console.log('Sending email with params:', templateParams)

      const result = await emailjs.send(
        'service_fy1ba8r',
        'template_kwoquph',
        templateParams,
        'R3Ex01igZ-XkkWvOs'
      )

      console.log('Email sent successfully:', result.text)
      onClose()
    } catch (error) {
      console.error('Failed to send email:', error)
      setError('Failed to submit order. Please try again.')
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-600">Order Confirmation</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="paymentCode" className="block text-sm font-medium text-gray-700 mb-1">
              10-digit Payment Code
            </label>
            <input
              type="text"
              id="paymentCode"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value)}
              required
              pattern="\d{10}"
              title="Please enter a 10-digit payment code"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors font-medium disabled:bg-pink-300"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  )
}


import React, { useState } from 'react'

interface LandingPageProps {
  onEmailSubmit: (email: string) => void
}

export default function LandingPage({ onEmailSubmit }: LandingPageProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')
    onEmailSubmit(email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-pink-600 font-serif text-center mb-8">
          Pinterest.tingz✨
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to our exclusive collection! Enter your email to start shopping.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Enter Shop ✨
          </button>
        </form>
      </div>
    </div>
  )
}


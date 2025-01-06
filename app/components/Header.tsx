import React from 'react'
import { Search, ShoppingBag } from 'lucide-react'

interface HeaderProps {
  cartItemsCount: number
  onCartClick: () => void
}

export default function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-600 font-serif">Pinterest.tingz✨</h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your aesthetic..."
              className="pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-300 focus:outline-none w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="relative cursor-pointer" onClick={onCartClick}>
            <ShoppingBag className="text-gray-600 hover:text-pink-500 transition-colors" size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


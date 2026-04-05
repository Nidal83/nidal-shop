'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-widest text-white uppercase">
            Nidal
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Home
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-wider">
              Shop
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
            Home
          </Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
            Shop
          </Link>
        </div>
      )}
    </nav>
  )
}

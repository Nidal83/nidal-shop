'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <ShoppingBag size={64} className="text-zinc-700 mx-auto mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any watches yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all"
        >
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-10">
        Your <span className="text-orange-500">Cart</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-zinc-900 rounded-2xl border border-white/10 p-4"
            >
              <Link href={`/product/${product.id}`} className="shrink-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-800">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="96px" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-white font-bold hover:text-orange-400 transition-colors truncate">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-3">{product.category}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-semibold w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <span className="text-orange-400 font-bold">${(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 h-fit sticky top-24">
          <h2 className="text-white font-bold text-lg uppercase tracking-wider mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm text-gray-400">
                <span className="truncate mr-2">{product.name} × {quantity}</span>
                <span className="shrink-0">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 mb-6 flex justify-between">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-orange-400 font-black text-xl">${total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105"
          >
            Checkout <ArrowRight size={18} />
          </Link>
          <Link
            href="/shop"
            className="block text-center text-gray-400 hover:text-white text-sm mt-4 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

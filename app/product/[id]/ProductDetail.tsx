'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm"
      >
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 mb-4">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-orange-500' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="150px" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">
            {product.category} Watch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-3">
            {product.name}
          </h1>
          <p className="text-gray-400 text-lg italic mb-6">&ldquo;{product.tagline}&rdquo;</p>
          <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

          {/* Features */}
          <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 mb-8">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Features</h3>
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle size={16} className="text-orange-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl font-black text-orange-400">${product.price}</span>
            <span className="text-green-400 text-sm font-semibold">In Stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              added
                ? 'bg-green-500 hover:bg-green-500 scale-95'
                : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
            } text-white`}
          >
            {added ? (
              <><CheckCircle size={22} /> Added to Cart!</>
            ) : (
              <><ShoppingCart size={22} /> Add to Cart</>
            )}
          </button>

          <Link
            href="/cart"
            className="mt-4 text-center text-gray-400 hover:text-white text-sm transition-colors"
          >
            View Cart &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

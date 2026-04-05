'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-white font-bold text-lg mb-1 hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{product.tagline}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-orange-400 font-bold text-xl">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

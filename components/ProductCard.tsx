'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const isKampanj = product.kampanj_price != null && product.kampanj_price < product.price

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
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            {isKampanj && (
              <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                SALE
              </span>
            )}
          </div>
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
          <div>
            {isKampanj ? (
              <div className="flex items-baseline gap-2">
                <span className="text-pink-400 font-black text-xl">${product.kampanj_price}</span>
                <span className="text-gray-500 text-sm line-through">${product.price}</span>
              </div>
            ) : (
              <span className="text-orange-400 font-bold text-xl">${product.price}</span>
            )}
          </div>
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

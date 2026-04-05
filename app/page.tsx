import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=80"
            alt="Nidal Hero Watch"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 border border-orange-500/30">
            New Collection 2025
          </span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight mb-6 leading-none">
            Time Is Your{' '}
            <span className="text-orange-500">Statement</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Precision-crafted timepieces for those who demand more. Bold design. Unmatched quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 text-lg"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">
            Our <span className="text-orange-500">Watches</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Two icons. Crafted for two different beasts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-zinc-900 border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80"
              alt="Nidal craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Our Story</span>
            <h2 className="text-4xl font-black uppercase tracking-tight mt-3 mb-6">
              Crafted for the <span className="text-orange-500">Bold</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Nidal was born from a passion for timepieces that speak louder than words. Every detail — from the sapphire crystal to the buckle — is chosen with intention.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We believe your watch should make a statement before you say a word.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-300 transition-colors"
            >
              Discover the collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: <Shield size={36} className="text-orange-500" />, title: '2-Year Warranty', desc: 'Every watch is covered by our full manufacturer warranty.' },
            { icon: <Truck size={36} className="text-orange-500" />, title: 'Free Shipping', desc: 'Complimentary shipping on all orders worldwide.' },
            { icon: <RotateCcw size={36} className="text-orange-500" />, title: '30-Day Returns', desc: 'Not satisfied? Return hassle-free within 30 days.' },
          ].map((item) => (
            <div key={item.title} className="bg-zinc-900 rounded-2xl border border-white/10 p-8">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

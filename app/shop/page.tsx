import { products } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">Collection</span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mt-3 mb-4">
          All <span className="text-orange-500">Watches</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Bold timepieces engineered for those who live without limits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

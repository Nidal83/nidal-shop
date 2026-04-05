// Extended product interface — backward compatible with all existing components
export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  kampanj_price?: number | null  // NEW: campaign/sale price
  images: string[]
  features: string[]
  category: string
  category_id?: string | null    // NEW
  brand?: string                 // NEW
  stock?: number                 // NEW
  is_active?: boolean            // NEW
}

// Static fallback — used only if DB is unavailable
export const staticProducts: Product[] = [
  {
    id: 'nidal-chronos',
    name: 'Nidal Chronos',
    tagline: 'Precision. Power. Legacy.',
    description:
      'The Nidal Chronos is a bold statement of luxury and craftsmanship. Featuring a sapphire crystal glass, Swiss-inspired movement, and a striking 42mm case — this watch commands attention in every room.',
    price: 349,
    kampanj_price: null,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
    ],
    features: [
      'Swiss-inspired quartz movement',
      'Sapphire crystal glass',
      '42mm stainless steel case',
      '100m water resistance',
      'Genuine leather strap',
    ],
    category: 'Luxury',
    brand: 'Nidal',
    stock: 50,
    is_active: true,
  },
  {
    id: 'nidal-sport',
    name: 'Nidal Sport',
    tagline: 'Built for the Bold.',
    description:
      "The Nidal Sport is engineered for those who push limits. With a vibrant dial, chronograph function, and reinforced rubber strap — it's the perfect companion from the track to the streets.",
    price: 249,
    kampanj_price: null,
    images: [
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&q=80',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=80',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    ],
    features: [
      'Chronograph function',
      '45mm reinforced case',
      '200m water resistance',
      'Mineral crystal glass',
      'Durable rubber strap',
    ],
    category: 'Sport',
    brand: 'Nidal',
    stock: 75,
    is_active: true,
  },
]

// Keep for backward compat (payment routes still use this)
export const products = staticProducts

export function getProductById(id: string): Product | undefined {
  return staticProducts.find((p) => p.id === id)
}

// Fetch live products from DB (used in server components)
export async function fetchProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 60 } })
    if (!res.ok) return staticProducts
    const json = await res.json()
    return json.data ?? staticProducts
  } catch {
    return staticProducts
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return getProductById(id)
    return await res.json()
  } catch {
    return getProductById(id)
  }
}

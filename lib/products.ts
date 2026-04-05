export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  images: string[]
  features: string[]
  category: string
}

export const products: Product[] = [
  {
    id: 'nidal-chronos',
    name: 'Nidal Chronos',
    tagline: 'Precision. Power. Legacy.',
    description:
      'The Nidal Chronos is a bold statement of luxury and craftsmanship. Featuring a sapphire crystal glass, Swiss-inspired movement, and a striking 42mm case — this watch commands attention in every room.',
    price: 349,
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
  },
  {
    id: 'nidal-sport',
    name: 'Nidal Sport',
    tagline: 'Built for the Bold.',
    description:
      "The Nidal Sport is engineered for those who push limits. With a vibrant dial, chronograph function, and reinforced rubber strap — it's the perfect companion from the track to the streets.",
    price: 249,
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
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

// Extended product type (database-backed)
export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  kampanj_price: number | null
  category_id: string | null
  category?: string // resolved category name for display
  brand: string
  stock: number
  images: string[]
  features: string[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at?: string
}

export interface Profile {
  id: string
  email: string
  role: 'admin' | 'sales' | 'customer'
  created_at?: string
}

export type UserRole = 'admin' | 'sales' | 'customer'

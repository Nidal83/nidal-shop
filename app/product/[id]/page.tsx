import { getProductById, products } from '@/lib/products'
import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return {}
  return {
    title: `${product.name} — Nidal Watches`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}

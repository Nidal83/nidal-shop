'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react'
import dynamic from 'next/dynamic'

const StripePayment = dynamic(() => import('@/components/checkout/StripePayment'), { ssr: false })
const PayPalPayment = dynamic(() => import('@/components/checkout/PayPalPayment'), { ssr: false })
const SwishPayment = dynamic(() => import('@/components/checkout/SwishPayment'), { ssr: false })

type Method = 'card' | 'paypal' | 'swish'

const methods: { id: Method; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'card',
    label: 'Credit Card',
    icon: <CreditCard size={18} />,
    color: 'border-orange-500 text-orange-400',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: <span className="font-black text-sm">PP</span>,
    color: 'border-[#003087] text-[#009cde]',
  },
  {
    id: 'swish',
    label: 'Swish',
    icon: <Smartphone size={18} />,
    color: 'border-[#00B9D1] text-[#00B9D1]',
  },
]

function OrderSummary() {
  const { items, total } = useCart()
  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 h-fit sticky top-24">
      <h2 className="text-white font-bold text-lg uppercase tracking-wider mb-6">Your Order</h2>
      <div className="space-y-4 mb-6">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{product.name}</p>
              <p className="text-gray-400 text-xs">Qty: {quantity}</p>
            </div>
            <span className="text-orange-400 font-bold shrink-0">${(product.price * quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
        <span className="text-white font-bold">Total</span>
        <span className="text-orange-400 font-black text-xl">${total.toFixed(2)}</span>
      </div>

      {/* Test credentials box */}
      <div className="space-y-2">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
          <p className="text-orange-400 text-xs font-bold mb-1">Card Test</p>
          <p className="text-gray-400 text-xs font-mono">4242 4242 4242 4242</p>
          <p className="text-gray-400 text-xs">Any future date · any CVC</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
          <p className="text-blue-400 text-xs font-bold mb-1">PayPal Sandbox</p>
          <p className="text-gray-400 text-xs">Use sandbox buyer account from developer.paypal.com</p>
        </div>
        <div className="bg-[#00B9D1]/10 border border-[#00B9D1]/20 rounded-xl p-3">
          <p className="text-[#00B9D1] text-xs font-bold mb-1">Swish Sandbox</p>
          <p className="text-gray-400 text-xs">Enter any valid phone format — auto-approves</p>
        </div>
      </div>
    </div>
  )
}

function CheckoutContent() {
  const { items, total } = useCart()
  const [activeMethod, setActiveMethod] = useState<Method>('card')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0 || activeMethod !== 'card') return
    setStripeLoading(true)
    setStripeError(null)
    setClientSecret(null)

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setStripeError(data.error)
        else setClientSecret(data.clientSecret)
      })
      .catch(() => setStripeError('Failed to initialize payment.'))
      .finally(() => setStripeLoading(false))
  }, [items, activeMethod])

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link href="/shop" className="text-orange-400 hover:text-orange-300">Shop now &rarr;</Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Left: Payment */}
      <div>
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">Payment Method</h2>

        {/* Method Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMethod(m.id)}
              className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all font-semibold text-sm ${
                activeMethod === m.id
                  ? `${m.color} bg-white/5`
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        {/* Active payment form */}
        {activeMethod === 'card' && (
          <>
            {stripeLoading && (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                Initializing secure payment...
              </div>
            )}
            {stripeError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                {stripeError}
              </div>
            )}
            {clientSecret && <StripePayment clientSecret={clientSecret} total={total} />}
          </>
        )}

        {activeMethod === 'paypal' && <PayPalPayment total={total} />}
        {activeMethod === 'swish' && <SwishPayment total={total} />}
      </div>

      {/* Right: Order Summary */}
      <OrderSummary />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm"
      >
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      <h1 className="text-4xl font-black uppercase tracking-tight mb-10">
        Secure <span className="text-orange-500">Checkout</span>
      </h1>
      <CheckoutContent />
    </div>
  )
}

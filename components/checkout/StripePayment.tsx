'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function StripeForm({ total }: { total: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Payment failed')
      setProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed')
      setProcessing(false)
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-800 rounded-2xl border border-white/10 p-6">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 text-lg"
      >
        <Lock size={18} />
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
      <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1">
        <Lock size={11} /> Secured by Stripe · Test mode
      </p>
    </form>
  )
}

export default function StripePayment({
  clientSecret,
  total,
}: {
  clientSecret: string
  total: number
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#f97316',
            colorBackground: '#27272a',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            borderRadius: '12px',
          },
        },
      }}
    >
      <StripeForm total={total} />
    </Elements>
  )
}

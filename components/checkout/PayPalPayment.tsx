'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function PayPalPayment({ total }: { total: number }) {
  const { items, clearCart } = useCart()
  const router = useRouter()

  async function createOrder() {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      }),
    })
    const data = await res.json()
    return data.orderID as string
  }

  async function onApprove(data: { orderID: string }) {
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID }),
    })
    const order = await res.json()
    if (order.status === 'COMPLETED') {
      clearCart()
      router.push('/success')
    }
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="space-y-4">
        <div className="bg-zinc-800 rounded-2xl border border-white/10 p-6">
          <p className="text-gray-400 text-sm mb-4 text-center">
            You will be redirected to PayPal to complete your payment of{' '}
            <span className="text-orange-400 font-bold">${total.toFixed(2)}</span>
          </p>
          <PayPalButtons
            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </div>
        <p className="text-center text-gray-500 text-xs">
          PayPal Sandbox · Test mode active
        </p>
      </div>
    </PayPalScriptProvider>
  )
}

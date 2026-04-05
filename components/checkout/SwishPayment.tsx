'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { Smartphone, CheckCircle, Loader2 } from 'lucide-react'

type Step = 'input' | 'waiting' | 'confirmed'

export default function SwishPayment({ total }: { total: number }) {
  const { clearCart } = useCart()
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<Step>('input')
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleaned = phone.replace(/\s/g, '')
    if (!/^\+?[0-9]{8,15}$/.test(cleaned)) {
      setError('Enter a valid phone number (e.g. +46701234567)')
      return
    }

    setStep('waiting')

    const res = await fetch('/api/swish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleaned, amount: total }),
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setStep('input')
      return
    }

    setRequestId(data.id)

    // Simulate Swish approval after 4 seconds (sandbox behaviour)
    setTimeout(() => {
      setStep('confirmed')
      setTimeout(() => {
        clearCart()
        router.push('/success')
      }, 1500)
    }, 4000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-2xl border border-white/10 p-6">
        {/* Swish branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00B9D1] flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <div>
            <p className="text-white font-bold">Swish</p>
            <p className="text-gray-400 text-xs">Mobile payment · Sandbox mode</p>
          </div>
          <span className="ml-auto text-orange-400 font-black text-lg">${total.toFixed(2)}</span>
        </div>

        {step === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Phone number connected to Swish
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+46 70 123 45 67"
                className="w-full bg-zinc-700 border border-white/10 focus:border-[#00B9D1] rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full bg-[#00B9D1] hover:bg-[#009db3] text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 text-lg"
            >
              <Smartphone size={18} />
              Send Payment Request
            </button>
          </form>
        )}

        {step === 'waiting' && (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#00B9D1]/20 border border-[#00B9D1]/30 flex items-center justify-center">
                <Loader2 size={32} className="text-[#00B9D1] animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Waiting for approval</p>
              <p className="text-gray-400 text-sm mt-1">
                Open Swish on your phone and confirm the payment
              </p>
              {requestId && (
                <p className="text-gray-600 text-xs mt-3 font-mono">{requestId}</p>
              )}
            </div>
            <div className="bg-[#00B9D1]/10 border border-[#00B9D1]/20 rounded-xl p-3">
              <p className="text-[#00B9D1] text-xs font-bold">Sandbox mode</p>
              <p className="text-gray-400 text-xs">Auto-approving in a few seconds...</p>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Payment Confirmed!</p>
              <p className="text-gray-400 text-sm">Redirecting to order confirmation...</p>
            </div>
          </div>
        )}
      </div>

      {step === 'input' && (
        <p className="text-center text-gray-500 text-xs">
          Swish Sandbox · Real Swish requires Swedish merchant certificates
        </p>
      )}
    </div>
  )
}

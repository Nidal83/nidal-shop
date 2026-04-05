import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-400" />
        </div>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
        Order <span className="text-green-400">Confirmed!</span>
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed mb-4">
        Thank you for your purchase. Your Nidal timepiece is on its way to you.
      </p>
      <p className="text-gray-500 text-sm mb-10">
        A confirmation email will be sent to your address shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all"
        >
          Continue Shopping <ArrowRight size={18} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

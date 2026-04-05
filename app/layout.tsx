import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Nidal Watches — Timepieces for the Bold',
  description: 'Discover bold, precision-crafted watches by Nidal. Shop our Chronos and Sport collections.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

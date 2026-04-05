import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold tracking-widest uppercase mb-3">Nidal</h3>
            <p className="text-sm leading-relaxed">
              Timepieces crafted for those who dare to stand out. Bold design meets precision engineering.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>hello@nidal.com</li>
              <li>+1 (555) 000-0000</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs">
          &copy; {new Date().getFullYear()} Nidal Watches. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Smartphone } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-center relative px-4">
        {/* Logo Centrado */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Smartphone className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            TelefonoShop
          </span>
        </Link>

        {/* Nav Absolute Right (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 absolute right-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            Catálogo
          </Link>
          <Link 
            href="/categorias" 
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            Categorías
          </Link>
        </nav>
      </div>
      {/* Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-20"></div>
    </header>
  )
}

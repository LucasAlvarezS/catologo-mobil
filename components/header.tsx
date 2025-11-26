import Link from "next/link"
import { Smartphone, Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-800/50 shadow-lg">
      <div className="container px-4 py-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">TelefonoShop</span>
              <span className="text-xs text-blue-300">Las mejores ofertas</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-blue-100 hover:text-white transition-colors font-medium">
              Catálogo
            </Link>
            <Link href="/categorias" className="text-sm text-blue-100 hover:text-white transition-colors font-medium">
              Categorías
            </Link>
            <Link href="/" className="text-sm text-blue-100 hover:text-white transition-colors font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"
import { Smartphone } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">TelefonoShop</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/categorias" className="text-sm font-medium hover:text-primary transition-colors">
            Categorías
          </Link>
        </nav>
      </div>
    </header>
  )
}

import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">Teléfono no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, el teléfono que buscas no existe o ya no está disponible.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

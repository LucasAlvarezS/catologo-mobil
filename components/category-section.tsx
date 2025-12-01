import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { TAG_LABELS } from "@/lib/types"
import { Smartphone, Camera, Landmark, Gamepad2, Flame } from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  uso_basico: <Smartphone className="w-8 h-8" />,
  redes_sociales: <Camera className="w-8 h-8" />,
  banco: <Landmark className="w-8 h-8" />,
  gaming_ligero: <Gamepad2 className="w-8 h-8" />,
  gaming_pesado: <Flame className="w-8 h-8" />,
}

export function CategorySection() {
  const categories = Object.entries(TAG_LABELS)

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Encuentra tu teléfono ideal</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(([key, { label, color }]) => (
          <Link key={key} href={`/?tags=${key}`}>
            <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                <div className={`p-3 rounded-full ${color} transition-colors`}>{CATEGORY_ICONS[key]}</div>
                <span className="font-medium text-sm">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

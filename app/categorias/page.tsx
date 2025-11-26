import type React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { PhoneGrid } from "@/components/phone-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TAG_LABELS, type TelefonoWithTags } from "@/lib/types"
import { ArrowRight, Smartphone, Camera, Landmark, Gamepad2, Flame } from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  uso_basico: <Smartphone className="w-6 h-6" />,
  redes_sociales: <Camera className="w-6 h-6" />,
  banco: <Landmark className="w-6 h-6" />,
  gaming_ligero: <Gamepad2 className="w-6 h-6" />,
  gaming_pesado: <Flame className="w-6 h-6" />,
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  uso_basico: "Perfectos para llamadas, mensajes y apps del día a día.",
  redes_sociales: "Ideales para Instagram, TikTok y capturar los mejores momentos.",
  banco: "Seguros y confiables para tus transacciones bancarias.",
  gaming_ligero: "Para disfrutar juegos casuales sin problemas.",
  gaming_pesado: "Máximo rendimiento para los juegos más exigentes.",
}

async function getPhonesByTag(tagName: string): Promise<TelefonoWithTags[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("telefonos")
    .select(`
      *,
      telefono_tags!inner (
        tag_id,
        tags!inner (
          id,
          nombre,
          descripcion
        )
      )
    `)
    .eq("activo", true)
    .eq("telefono_tags.tags.nombre", tagName)
    .limit(4)

  return (data || []).map((phone: any) => ({
    ...phone,
    tags: phone.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }))
}

export default async function CategoriasPage() {
  const categories = Object.entries(TAG_LABELS)

  const phonesByCategory = await Promise.all(
    categories.map(async ([key]) => ({
      key,
      phones: await getPhonesByTag(key),
    })),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Categorías</h1>
        <p className="text-muted-foreground mb-8">Encuentra el teléfono perfecto según tus necesidades.</p>

        <div className="space-y-12">
          {phonesByCategory.map(({ key, phones }) => {
            const tagInfo = TAG_LABELS[key]
            if (!tagInfo || phones.length === 0) return null

            return (
              <section key={key}>
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-full ${tagInfo.color}`}>{CATEGORY_ICONS[key]}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tagInfo.label}</CardTitle>
                      <p className="text-sm text-muted-foreground">{CATEGORY_DESCRIPTIONS[key]}</p>
                    </div>
                    <Button asChild variant="ghost" className="hidden sm:flex">
                      <Link href={`/?tags=${key}`}>
                        Ver todos
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <PhoneGrid phones={phones} />
                    <Button asChild variant="outline" className="w-full mt-4 sm:hidden bg-transparent">
                      <Link href={`/?tags=${key}`}>
                        Ver todos los teléfonos de {tagInfo.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}

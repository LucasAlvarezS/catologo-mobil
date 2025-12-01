import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type TelefonoWithTags, TAG_LABELS } from "@/lib/types"
import { formatPrice, generateWhatsAppLink } from "@/lib/utils"
import { ArrowLeft, MessageCircle, Cpu, HardDrive, Battery, Camera, Smartphone, MemoryStick } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPhone(id: string): Promise<TelefonoWithTags | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("telefonos")
    .select(`
      *,
      telefono_tags (
        tag_id,
        tags (
          id,
          nombre,
          descripcion
        )
      )
    `)
    .eq("id", id)
    .eq("activo", true)
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    tags: data.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const phone = await getPhone(id)

  if (!phone) {
    return { title: "Teléfono no encontrado" }
  }

  return {
    title: `${phone.marca} ${phone.modelo} - TelefonoShop`,
    description:
      phone.descripcion_corta ||
      `Conoce el ${phone.marca} ${phone.modelo}. ${phone.ram} RAM, ${phone.almacenamiento} almacenamiento.`,
    openGraph: {
      title: `${phone.marca} ${phone.modelo}`,
      description: phone.descripcion_corta || `${phone.ram} RAM, ${phone.almacenamiento}`,
      images: phone.foto_url ? [phone.foto_url] : [],
    },
  }
}

export default async function PhoneDetailPage({ params }: PageProps) {
  const { id } = await params
  const phone = await getPhone(id)

  if (!phone) {
    notFound()
  }

  const hasDiscount = phone.precio_descuento && phone.precio_descuento < phone.precio_lista
  const hasPlanPrice = phone.precio_plan && phone.precio_plan < phone.precio_lista
  const whatsappLink = generateWhatsAppLink(phone.modelo, phone.marca)

  const specs = [
    { icon: <MemoryStick className="w-5 h-5" />, label: "RAM", value: phone.ram },
    { icon: <HardDrive className="w-5 h-5" />, label: "Almacenamiento", value: phone.almacenamiento },
    { icon: <Cpu className="w-5 h-5" />, label: "Procesador", value: phone.procesador },
    { icon: <Battery className="w-5 h-5" />, label: "Batería", value: phone.bateria },
    { icon: <Camera className="w-5 h-5" />, label: "Cámara", value: phone.camara },
    { icon: <Smartphone className="w-5 h-5" />, label: "Pantalla", value: phone.pantalla },
  ].filter((spec) => spec.value)

  const TAG_DESCRIPTIONS: Record<string, string> = {
    uso_basico: "Ideal para llamadas, mensajes y aplicaciones básicas del día a día.",
    redes_sociales: "Perfecto para Instagram, TikTok, Facebook y capturar fotos increíbles.",
    banco: "Seguro y confiable para apps bancarias y pagos móviles.",
    gaming_ligero: "Corre juegos casuales como Candy Crush, Subway Surfers sin problemas.",
    gaming_pesado: "Alto rendimiento para juegos exigentes como Call of Duty Mobile, Genshin Impact.",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={phone.foto_url || "/placeholder.svg?height=600&width=600&query=smartphone"}
                alt={`${phone.marca} ${phone.modelo}`}
                fill
                className="object-contain p-8"
                priority
              />
              {hasPlanPrice && (
                <Badge className="absolute top-4 right-4 bg-emerald-500 text-white text-sm px-3 py-1">Con Plan</Badge>
              )}
            </div>

            {/* Thumbnail gallery */}
            {(phone.foto_url_2 || phone.foto_url_3) && (
              <div className="flex gap-2">
                {[phone.foto_url, phone.foto_url_2, phone.foto_url_3].filter(Boolean).map((url, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                  >
                    <Image src={url || ""} alt={`${phone.modelo} vista ${i + 1}`} fill className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">{phone.marca}</p>
              <h1 className="text-3xl font-bold text-foreground mt-1">{phone.modelo}</h1>
              {phone.descripcion_corta && <p className="text-muted-foreground mt-2">{phone.descripcion_corta}</p>}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {phone.tags.map((tag) => {
                const tagInfo = TAG_LABELS[tag.nombre]
                return tagInfo ? (
                  <Badge key={tag.id} variant="secondary" className={`${tagInfo.color} text-sm`}>
                    {tagInfo.label}
                  </Badge>
                ) : null
              })}
            </div>

            {/* Prices */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* Precio con Plan - Principal */}
                {hasPlanPrice && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                    <p className="text-sm text-emerald-700 font-medium mb-1">Precio con Plan</p>
                    <span className="text-4xl font-bold text-emerald-600">{formatPrice(phone.precio_plan!)}</span>
                  </div>
                )}

                {/* Precio Oferta - Secundario */}
                {hasDiscount && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-red-700 font-medium">Precio Oferta</p>
                      <Badge variant="destructive" className="text-xs">
                        -{Math.round((1 - phone.precio_descuento! / phone.precio_lista) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-red-600">{formatPrice(phone.precio_descuento!)}</span>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(phone.precio_lista)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Precio de Lista - Si no hay ofertas ni plan */}
                {!hasPlanPrice && !hasDiscount && (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Precio</p>
                    <span className="text-3xl font-bold text-foreground">{formatPrice(phone.precio_lista)}</span>
                  </div>
                )}

                {/* Precio de lista como referencia si hay descuento pero no plan */}
                {!hasPlanPrice && hasDiscount && (
                  <p className="text-sm text-muted-foreground text-center">
                    Precio de lista: {formatPrice(phone.precio_lista)}
                  </p>
                )}

                {/* Precio sin plan como referencia si hay precio con plan */}
                {hasPlanPrice && !hasDiscount && (
                  <p className="text-sm text-muted-foreground text-center">
                    Sin plan: {formatPrice(phone.precio_lista)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp Button */}
            <Button asChild size="lg" className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg py-6">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar por WhatsApp
              </a>
            </Button>

            <Separator />

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Especificaciones</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="p-2 rounded-md bg-muted text-muted-foreground">{spec.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{spec.label}</p>
                      <p className="font-medium">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usage Tags Explained */}
            {phone.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ideal para</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {phone.tags.map((tag) => {
                    const tagInfo = TAG_LABELS[tag.nombre]
                    const description = TAG_DESCRIPTIONS[tag.nombre]
                    return tagInfo && description ? (
                      <div key={tag.id} className="flex items-start gap-3">
                        <Badge variant="secondary" className={`${tagInfo.color} shrink-0 mt-0.5`}>
                          {tagInfo.label}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    ) : null
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

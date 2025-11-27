"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type TelefonoWithTags, TAG_LABELS } from "@/lib/types"
import { formatPrice, generateWhatsAppLink } from "@/lib/utils"
import { ArrowLeft, MessageCircle, Cpu, HardDrive, Battery, Camera, Smartphone, MemoryStick, Scale } from "lucide-react"
import { PhoneSelectorModal } from "@/components/phone-selector-modal"
import { PhoneComparison } from "@/components/phone-comparison"

interface PhoneDetailClientProps {
  phone: TelefonoWithTags
  allPhones: TelefonoWithTags[]
}

export function PhoneDetailClient({ phone, allPhones }: PhoneDetailClientProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<string[] | null>(null)

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

  const handleSelectForComparison = (selectedIds: string[]) => {
    setSelectedForComparison(selectedIds)
    setShowSelector(false)
  }

  const phonesForComparison = selectedForComparison
    ? allPhones.filter((p) => selectedForComparison.includes(p.id))
    : null

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="container px-4 py-6">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Image Section - Premium */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-lg">
                <Image
                  src={phone.foto_url || "/placeholder.svg?height=600&width=600&query=smartphone"}
                  alt={`${phone.marca} ${phone.modelo}`}
                  fill
                  className="object-contain p-8"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{Math.round((1 - phone.precio_descuento! / phone.precio_lista) * 100)}% OFF
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ✓ En stock
                </div>
              </div>

              {/* Thumbnail gallery */}
              {(phone.foto_url_2 || phone.foto_url_3) && (
                <div className="flex gap-3">
                  {[phone.foto_url, phone.foto_url_2, phone.foto_url_3].filter(Boolean).map((url, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 hover:border-blue-400 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <Image
                        src={url || ""}
                        alt={`${phone.modelo} vista ${i + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section - Premium Sales Focused */}
            <div className="space-y-6">
              {/* Title & Brand */}
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">{phone.marca}</p>
                <h1 className="text-4xl font-bold text-slate-900">{phone.modelo}</h1>
                {phone.descripcion_corta && (
                  <p className="text-lg text-slate-600 leading-relaxed">{phone.descripcion_corta}</p>
                )}
              </div>

              {/* Tags - Usage Categories */}
              <div className="flex flex-wrap gap-2 pt-2">
                {phone.tags.map((tag) => {
                  const tagInfo = TAG_LABELS[tag.nombre]
                  return tagInfo ? (
                    <Badge
                      key={tag.id}
                      className={`${tagInfo.color} text-sm font-semibold px-3 py-1 hover:scale-105 transition-transform`}
                    >
                      {tagInfo.label}
                    </Badge>
                  ) : null
                })}
              </div>

              {/* Prices - Large & Prominent */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-sm space-y-3">
                {hasDiscount ? (
                  <div className="space-y-2">
                    <p className="text-slate-600 text-sm font-medium">Precio promocional</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-bold text-blue-600">
                        {formatPrice(phone.precio_descuento!)}
                      </span>
                      <span className="text-xl text-slate-500 line-through">
                        {formatPrice(phone.precio_lista)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium pt-2">
                      ({formatPrice(phone.precio_descuento!)})
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-600 text-sm font-medium">Precio</p>
                    <span className="text-5xl font-bold text-slate-900">
                      {formatPrice(phone.precio_lista)}
                    </span>
                    <p className="text-xs text-slate-500 font-medium pt-2">
                      ({formatPrice(phone.precio_lista)})
                    </p>
                  </div>
                )}

                {hasPlanPrice && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 mt-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">CON PLAN</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {formatPrice(phone.precio_plan!)}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        ({formatPrice(phone.precio_plan!)})
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
                    Todos los precios con IVA incluido
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 font-semibold shadow-lg"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Consultar por WhatsApp
                  </a>
                </Button>

                <Button
                  onClick={() => setShowSelector(true)}
                  size="lg"
                  className="w-full border-2 border-blue-200 hover:bg-blue-50 text-slate-900 py-6 font-semibold"
                  variant="outline"
                >
                  <Scale className="w-5 h-5 mr-2" />
                  Comparar con otro modelo
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Specifications - Grid */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                          {spec.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">
                            {spec.label}
                          </p>
                          <p className="font-bold text-slate-900 text-sm mt-1 break-words">{spec.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Tags Explained - Educational */}
              {phone.tags.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    ¿Para qué sirve este celular?
                  </h2>
                  <div className="space-y-3">
                    {phone.tags.map((tag) => {
                      const tagInfo = TAG_LABELS[tag.nombre]
                      const description = TAG_DESCRIPTIONS[tag.nombre]
                      return tagInfo && description ? (
                        <div
                          key={tag.id}
                          className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
                        >
                          <Badge className={`${tagInfo.color} flex-shrink-0 mt-0.5 font-semibold`}>
                            {tagInfo.label}
                          </Badge>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{description}</p>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Selector */}
      {showSelector && (
        <PhoneSelectorModal
          phones={allPhones}
          currentPhoneId={phone.id}
          onSelect={handleSelectForComparison}
          onClose={() => setShowSelector(false)}
        />
      )}

      {/* Modal Comparación */}
      {phonesForComparison && (
        <PhoneComparison
          phones={phonesForComparison}
          onClose={() => setSelectedForComparison(null)}
        />
      )}
    </>
  )
}

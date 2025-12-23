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
import { ArrowLeft, MessageCircle, Cpu, HardDrive, Battery, Camera, Smartphone, MemoryStick, Scale, Check, Settings, Sparkles, CreditCard, Banknote, Wifi, Globe, Phone, Facebook, Instagram, Twitter, Package, ChevronLeft, ChevronRight, Shield, ArrowLeftRight } from "lucide-react"
import { PhoneSelectorModal } from "@/components/phone-selector-modal"
import { PhoneComparison } from "@/components/phone-comparison"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface PhoneDetailClientProps {
  phone: TelefonoWithTags
  allPhones: TelefonoWithTags[]
}

export function PhoneDetailClient({ phone, allPhones }: PhoneDetailClientProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<string[] | null>(null)
  const [selectedImage, setSelectedImage] = useState(phone.foto_url)

  const hasDiscount = (phone.precio_descuento && phone.precio_descuento < phone.precio_lista) || (phone.porcentaje_descuento && phone.porcentaje_descuento > 0)
  const whatsappLink = generateWhatsAppLink(phone.modelo, phone.marca)

  const images = [phone.foto_url, phone.foto_url_2, phone.foto_url_3].filter(Boolean) as string[]

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentIndex = images.indexOf(selectedImage || images[0])
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setSelectedImage(images[prevIndex])
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentIndex = images.indexOf(selectedImage || images[0])
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setSelectedImage(images[nextIndex])
  }

  // Financing calculation
  const basePrice = phone.precio_plan || phone.precio_lista
  const pieInicial = phone.pie_inicial || 49900
  const cuotasCount = phone.cantidad_cuotas || 18
  
  // Plan details logic
  const legacyPlan = {
    nombre: phone.nombre_plan || "Plan MAX L LIBRE",
    gigas: phone.info_gigas_plan || "300GB",
    precio_mensual: phone.precio_mensual_plan || 7990,
    precio_mensual_normal: phone.precio_mensual_plan_normal || 14990,
    meses_promocion: phone.meses_plan_promocional || 6
  }

  const availablePlans = phone.planes && phone.planes.length > 0 
    ? phone.planes 
    : (phone.incluye_plan ? [legacyPlan] : [])

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0)
  const currentPlan = availablePlans[selectedPlanIndex] || legacyPlan

  const planName = currentPlan.nombre
  const planGigas = currentPlan.gigas
  const planPrice = Number(currentPlan.precio_mensual)
  const planPriceNormal = Number(currentPlan.precio_mensual_normal)
  const planMonthsPromo = Number(currentPlan.meses_promocion)
  const planDiscount = planPriceNormal > 0 ? Math.round((1 - planPrice / planPriceNormal) * 100) : 0

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
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-lg group">
                <Image
                  src={selectedImage || "/placeholder.svg?height=600&width=600&query=smartphone"}
                  alt={`${phone.marca} ${phone.modelo}`}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg z-10">
                    -{phone.porcentaje_descuento ? phone.porcentaje_descuento : Math.round((1 - phone.precio_descuento! / phone.precio_lista) * 100)}% OFF
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center z-10">
                  <Check className="w-4 h-4 mr-1" /> En stock
                </div>
              </div>

              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(url)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 transition-colors cursor-pointer shadow-sm hover:shadow-md ${
                        selectedImage === url ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-400"
                      }`}
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
              <div className="space-y-2 text-center">
                <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">{phone.marca}</p>
                <h1 className="text-4xl font-bold text-slate-900">{phone.modelo}</h1>
                {phone.descripcion_corta && (
                  <p className="text-lg text-slate-600 leading-relaxed">{phone.descripcion_corta}</p>
                )}
              </div>

              {/* Tags - Usage Categories */}
              <div className="flex flex-wrap gap-2 pt-2 justify-center">
                {phone.tags.map((tag) => {
                  const tagInfo = TAG_LABELS[tag.nombre]
                  const label = tagInfo ? tagInfo.label : tag.nombre
                  
                  let badgeStyle = {}
                  let badgeClass = "text-sm font-semibold px-3 py-1 hover:scale-105 transition-transform"
                  
                  if (tag.color) {
                     badgeStyle = { backgroundColor: tag.color, color: '#ffffff' }
                  } else if (tagInfo) {
                     badgeClass = `${tagInfo.color} ${badgeClass}`
                  } else {
                     badgeClass = `bg-slate-100 text-slate-700 ${badgeClass}`
                  }

                  return (
                    <Badge
                      key={tag.id}
                      className={badgeClass}
                      style={badgeStyle}
                    >
                      {label}
                    </Badge>
                  )
                })}
              </div>

              {/* Prices - Large & Prominent */}
              <div className="space-y-6">
                {/* Financing Selector - Only if plan is available */}
                {phone.incluye_plan ? (
                  <>
                    {/* Plan Selector */}
                    {availablePlans.length > 1 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-slate-900">ELIGE TU PLAN</h3>
                        <div className="flex flex-wrap gap-2">
                          {availablePlans.map((plan, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedPlanIndex(idx)}
                              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                                selectedPlanIndex === idx
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {plan.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Device Price Display */}
                    <div className="space-y-3">
                      {/* Precio con Plan */}
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100 relative overflow-hidden flex justify-between items-center">
                        <div>
                          <p className="text-blue-800 font-semibold text-sm mb-1">Precio con Plan</p>
                          <span className="text-3xl font-bold text-blue-900 block">{formatPrice(basePrice)}</span>
                        </div>
                        <div className="text-right">
                           {phone.precio_lista > basePrice && (
                             <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                               Ahorras: {formatPrice(phone.precio_lista - basePrice)}
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Precio Tarjeta Hites */}
                      {phone.precio_tarjeta_hites && (
                        <div className="bg-white rounded-xl p-4 border border-slate-200 relative overflow-hidden flex justify-between items-center shadow-sm">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-slate-700 font-semibold text-sm">Precio con Tarjeta</p>
                              <div className="h-6 w-16 relative">
                                <Image 
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_Hites.svg/2560px-Logo_Hites.svg.png" 
                                  alt="Hites" 
                                  fill 
                                  className="object-contain" 
                                />
                              </div>
                            </div>
                            <span className="text-3xl font-bold text-slate-900 block">{formatPrice(phone.precio_tarjeta_hites)}</span>
                          </div>
                          <div className="text-right">
                             {phone.precio_lista > phone.precio_tarjeta_hites && (
                               <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                                 Ahorras: {formatPrice(phone.precio_lista - phone.precio_tarjeta_hites)}
                               </div>
                             )}
                          </div>
                        </div>
                      )}
                      
                      {/* Precio Prepago (Normal) */}
                       <div className="bg-white rounded-xl p-4 border border-slate-100 text-center flex justify-between items-center">
                        <p className="text-slate-500 font-medium text-sm">Precio Prepago</p>
                        <span className="text-xl font-bold text-slate-700">{formatPrice(phone.precio_lista)}</span>
                      </div>
                    </div>

                    {/* Dynamic Content Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                      {/* Plan Details */}
                      <div className="p-6 space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Plan Asociado</p>
                            <h4 className="text-xl font-bold text-slate-900">{planName}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {planGigas} a alta velocidad
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-500 hover:bg-red-600 mb-2">{planDiscount}% DESCUENTO</Badge>
                            <div className="flex flex-col items-end">
                              <span className="text-2xl font-bold text-slate-900">{formatPrice(planPrice)}</span>
                              <span className="text-xs text-slate-500 font-medium">Mensual por {planMonthsPromo} meses</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Luego desde el mes {planMonthsPromo + 1} {formatPrice(planPriceNormal)}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm font-medium text-slate-700">Este plan incluye:</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4 text-green-500" />
                              <span>Minutos Libres</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Globe className="w-4 h-4 text-blue-500" />
                              <span>Roaming 2GB</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Wifi className="w-4 h-4 text-indigo-500" />
                              <span>Redes Sociales Libres</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <div className="flex -space-x-1">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] border border-white">f</div>
                                <div className="w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center text-white text-[10px] border border-white">ig</div>
                                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[10px] border border-white">x</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-slate-400 text-center">
                        Precios incluyen IVA. Sujeto a evaluación comercial.
                      </p>
                    </div>
                  </>
                ) : (
                  /* No Plan - Direct Purchase Options */
                  <div className="grid grid-cols-1 gap-4">
                    {/* 1. Portability Price (Highest Priority) */}
                    {phone.precio_portabilidad && (
                      <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200 text-center space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                          <ArrowLeftRight className="w-3 h-3" /> PORTABILIDAD
                        </div>
                        <p className="text-sm text-red-700 font-bold uppercase tracking-wide">Precio Portabilidad</p>
                        <div className="flex items-center justify-center gap-3">
                          <p className="text-4xl font-bold text-red-900">{formatPrice(phone.precio_portabilidad)}</p>
                        </div>
                        <p className="text-xs text-red-600 font-medium">Cámbiate a nuestra compañía y obtén este precio</p>
                      </div>
                    )}

                    {/* 2. Hites Card Price (Second Priority) */}
                    {phone.precio_tarjeta_hites && (
                      <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200 text-center space-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> TARJETA HITES
                        </div>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Image src="/images/tarjetaHites.png" alt="Tarjeta Hites" width={60} height={40} className="object-contain h-8 w-auto" />
                          <p className="text-sm text-blue-700 font-bold uppercase tracking-wide">Precio Tarjeta Hites</p>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <p className="text-4xl font-bold text-blue-900">{formatPrice(phone.precio_tarjeta_hites)}</p>
                        </div>
                        <p className="text-xs text-blue-600 font-medium">Pagando con tu tarjeta Hites</p>
                      </div>
                    )}

                    {/* 3. Standard Discount / List Price */}
                    <div className={`rounded-xl p-4 border text-center space-y-1 ${(!phone.precio_portabilidad && !phone.precio_tarjeta_hites) ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'}`}>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                        {hasDiscount ? "Precio Oferta" : "Precio Normal"}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        {hasDiscount ? (
                          <>
                            <p className="text-3xl font-bold text-slate-900">{formatPrice(phone.precio_descuento!)}</p>
                            <p className="text-lg text-slate-400 line-through decoration-slate-400/50">{formatPrice(phone.precio_lista)}</p>
                          </>
                        ) : (
                          <p className="text-3xl font-bold text-slate-900">{formatPrice(phone.precio_lista)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Colors */}
              {phone.colores && phone.colores.length > 0 && (
                <div className="space-y-3 text-center py-2">
                  <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">Colores Disponibles</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {phone.colores.map((color, i) => (
                      <div key={`${color.nombre}-${i}`} className="group relative flex flex-col items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-slate-200 shadow-sm group-hover:scale-110 group-hover:border-blue-400 transition-all cursor-help"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs text-slate-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-md border z-10">
                          {color.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
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
                  Comparar con IA
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Specifications - Grid */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                  Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec, i) => {
                    const isRam = spec.label === "RAM"
                    const isStorage = spec.label === "Almacenamiento"
                    const showRamInfo = isRam && phone.tiene_ram_virtual
                    const showStorageInfo = isStorage && phone.tiene_almacenamiento_expandible
                    
                    const content = (
                      <div
                        className={`bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center text-center h-full ${
                          showRamInfo || showStorageInfo ? "cursor-help" : ""
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mb-2">
                          {spec.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">
                            {spec.label}
                          </p>
                          <p className="font-bold text-slate-900 text-sm mt-1 break-words">{spec.value}</p>
                        </div>
                      </div>
                    )

                    if (showRamInfo) {
                      return (
                        <HoverCard key={i}>
                          <HoverCardTrigger asChild>
                            {content}
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">RAM Ampliable / Virtual</h4>
                              <p className="text-sm text-muted-foreground">
                                El teléfono usa parte de la memoria interna (almacenamiento) para simular RAM, mejorando el rendimiento en multitarea.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    }

                    if (showStorageInfo) {
                      return (
                        <HoverCard key={i}>
                          <HoverCardTrigger asChild>
                            {content}
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Almacenamiento Ampliable</h4>
                              <p className="text-sm text-muted-foreground">
                                Puedes expandir la capacidad de almacenamiento mediante una tarjeta microSD o utilizando servicios de almacenamiento en la nube.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    }

                    return <div key={i}>{content}</div>
                  })}
                </div>
              </div>

              {/* Detailed Specs Button & Drawer */}
              {phone.especificaciones && (
                <div className="pt-4 flex justify-center">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                        Ver más características
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                      <SheetHeader className="mb-6">
                        <SheetTitle>Especificaciones Técnicas</SheetTitle>
                      </SheetHeader>
                      
                      <div className="space-y-6">
                        {/* Software */}
                        {phone.especificaciones.software && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Cpu className="h-5 w-5 text-primary" />
                              Software
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.software.tipo_celular && (
                                <>
                                  <span className="text-slate-500">Tipo de Celular</span>
                                  <span className="font-medium text-right">{phone.especificaciones.software.tipo_celular}</span>
                                </>
                              )}
                              {phone.especificaciones.software.condicion && (
                                <>
                                  <span className="text-slate-500">Condición</span>
                                  <span className="font-medium text-right">{phone.especificaciones.software.condicion}</span>
                                </>
                              )}
                              {phone.especificaciones.software.os && (
                                <>
                                  <span className="text-slate-500">OS</span>
                                  <span className="font-medium text-right">{phone.especificaciones.software.os}</span>
                                </>
                              )}
                              {phone.especificaciones.software.version && (
                                <>
                                  <span className="text-slate-500">Versión</span>
                                  <span className="font-medium text-right">{phone.especificaciones.software.version}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pantalla */}
                        {phone.especificaciones.pantalla && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Smartphone className="h-5 w-5 text-primary" />
                              Pantalla
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.pantalla.tamano && (
                                <>
                                  <span className="text-slate-500">Tamaño</span>
                                  <span className="font-medium text-right">{phone.especificaciones.pantalla.tamano}</span>
                                </>
                              )}
                              {phone.especificaciones.pantalla.resolucion && (
                                <>
                                  <span className="text-slate-500">Resolución</span>
                                  <span className="font-medium text-right">{phone.especificaciones.pantalla.resolucion}</span>
                                </>
                              )}
                              {phone.especificaciones.pantalla.densidad && (
                                <>
                                  <span className="text-slate-500">Densidad</span>
                                  <span className="font-medium text-right">{phone.especificaciones.pantalla.densidad}</span>
                                </>
                              )}
                              {phone.especificaciones.pantalla.tipo && (
                                <>
                                  <span className="text-slate-500">Tipo</span>
                                  <span className="font-medium text-right">{phone.especificaciones.pantalla.tipo}</span>
                                </>
                              )}
                              {phone.especificaciones.pantalla.tasa_refresco && (
                                <>
                                  <span className="text-slate-500">Tasa de Refresco</span>
                                  <span className="font-medium text-right">{phone.especificaciones.pantalla.tasa_refresco}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Cámara */}
                        {phone.especificaciones.camara && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Camera className="h-5 w-5 text-primary" />
                              Cámara
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.camara.trasera_cantidad && (
                                <>
                                  <span className="text-slate-500">Cámaras Traseras</span>
                                  <span className="font-medium text-right">{phone.especificaciones.camara.trasera_cantidad}</span>
                                </>
                              )}
                              {phone.especificaciones.camara.trasera_descripcion && (
                                <>
                                  <span className="text-slate-500">Principal</span>
                                  <span className="font-medium text-right">{phone.especificaciones.camara.trasera_descripcion}</span>
                                </>
                              )}
                              {phone.especificaciones.camara.frontal_descripcion && (
                                <>
                                  <span className="text-slate-500">Frontal / Secundaria</span>
                                  <span className="font-medium text-right">{phone.especificaciones.camara.frontal_descripcion}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Batería */}
                        {phone.especificaciones.bateria && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Battery className="h-5 w-5 text-primary" />
                              Batería
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.bateria.tipo && (
                                <>
                                  <span className="text-slate-500">Tipo</span>
                                  <span className="font-medium text-right">{phone.especificaciones.bateria.tipo}</span>
                                </>
                              )}
                              {phone.especificaciones.bateria.capacidad && (
                                <>
                                  <span className="text-slate-500">Capacidad</span>
                                  <span className="font-medium text-right">{phone.especificaciones.bateria.capacidad}</span>
                                </>
                              )}
                              {phone.especificaciones.bateria.carga_rapida && (
                                <>
                                  <span className="text-slate-500">Carga Rápida</span>
                                  <span className="font-medium text-right">{phone.especificaciones.bateria.carga_rapida}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Memoria */}
                        {phone.especificaciones.memoria && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <HardDrive className="h-5 w-5 text-primary" />
                              Memoria
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.memoria.sim_tipo && (
                                <>
                                  <span className="text-slate-500">Tipo de SIM</span>
                                  <span className="font-medium text-right">{phone.especificaciones.memoria.sim_tipo}</span>
                                </>
                              )}
                              {phone.especificaciones.memoria.dual_sim && (
                                <>
                                  <span className="text-slate-500">Dual SIM</span>
                                  <span className="font-medium text-right">{phone.especificaciones.memoria.dual_sim}</span>
                                </>
                              )}
                              {phone.especificaciones.memoria.esim && (
                                <>
                                  <span className="text-slate-500">eSIM</span>
                                  <span className="font-medium text-right">{phone.especificaciones.memoria.esim}</span>
                                </>
                              )}
                              {phone.especificaciones.memoria.ram && (
                                <>
                                  <span className="text-slate-500">RAM</span>
                                  <span className="font-medium text-right">{phone.especificaciones.memoria.ram}</span>
                                </>
                              )}
                              {phone.especificaciones.memoria.almacenamiento && (
                                <>
                                  <span className="text-slate-500">Interna</span>
                                  <span className="font-medium text-right">{phone.especificaciones.memoria.almacenamiento}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Procesador */}
                        {phone.especificaciones.procesador && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Cpu className="h-5 w-5 text-primary" />
                              Procesador
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.procesador.chipset && (
                                <>
                                  <span className="text-slate-500">Chipset</span>
                                  <span className="font-medium text-right">{phone.especificaciones.procesador.chipset}</span>
                                </>
                              )}
                              {phone.especificaciones.procesador.nucleos && (
                                <>
                                  <span className="text-slate-500">Núcleos</span>
                                  <span className="font-medium text-right">{phone.especificaciones.procesador.nucleos}</span>
                                </>
                              )}
                              {phone.especificaciones.procesador.velocidad && (
                                <>
                                  <span className="text-slate-500">Velocidad</span>
                                  <span className="font-medium text-right">{phone.especificaciones.procesador.velocidad}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Dimensiones */}
                        {phone.especificaciones.dimensiones && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Scale className="h-5 w-5 text-primary" />
                              Dimensiones
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.dimensiones.medidas && (
                                <>
                                  <span className="text-slate-500">Medidas</span>
                                  <span className="font-medium text-right">{phone.especificaciones.dimensiones.medidas}</span>
                                </>
                              )}
                              {phone.especificaciones.dimensiones.peso && (
                                <>
                                  <span className="text-slate-500">Peso</span>
                                  <span className="font-medium text-right">{phone.especificaciones.dimensiones.peso}</span>
                                </>
                              )}
                              {phone.especificaciones.dimensiones.indice_sar && (
                                <>
                                  <span className="text-slate-500">Índice SAR</span>
                                  <span className="font-medium text-right">{phone.especificaciones.dimensiones.indice_sar}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Contenido Caja */}
                        {phone.especificaciones.contenido_caja && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Package className="h-5 w-5 text-primary" />
                              Contenido Caja
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.contenido_caja.cable && (
                                <>
                                  <span className="text-slate-500">Cable USB</span>
                                  <span className="font-medium text-right">{phone.especificaciones.contenido_caja.cable}</span>
                                </>
                              )}
                              {phone.especificaciones.contenido_caja.cargador && (
                                <>
                                  <span className="text-slate-500">Cargador</span>
                                  <span className="font-medium text-right">{phone.especificaciones.contenido_caja.cargador}</span>
                                </>
                              )}
                              {phone.especificaciones.contenido_caja.manual && (
                                <>
                                  <span className="text-slate-500">Manual</span>
                                  <span className="font-medium text-right">{phone.especificaciones.contenido_caja.manual}</span>
                                </>
                              )}
                              {phone.especificaciones.contenido_caja.audifonos && (
                                <>
                                  <span className="text-slate-500">Audífonos</span>
                                  <span className="font-medium text-right">{phone.especificaciones.contenido_caja.audifonos}</span>
                                </>
                              )}
                              {phone.especificaciones.contenido_caja.tarjeta_memoria && (
                                <>
                                  <span className="text-slate-500">Tarjeta de Memoria</span>
                                  <span className="font-medium text-right">{phone.especificaciones.contenido_caja.tarjeta_memoria}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Sensores */}
                        {phone.especificaciones.sensores && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Wifi className="h-5 w-5 text-primary" />
                              Sensores
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.sensores.huella && (
                                <>
                                  <span className="text-slate-500">Huella</span>
                                  <span className="font-medium text-right">{phone.especificaciones.sensores.huella}</span>
                                </>
                              )}
                              {phone.especificaciones.sensores.facial && (
                                <>
                                  <span className="text-slate-500">Facial</span>
                                  <span className="font-medium text-right">{phone.especificaciones.sensores.facial}</span>
                                </>
                              )}
                              {phone.especificaciones.sensores.luz && (
                                <>
                                  <span className="text-slate-500">Luz</span>
                                  <span className="font-medium text-right">{phone.especificaciones.sensores.luz}</span>
                                </>
                              )}
                              {phone.especificaciones.sensores.giroscopio && (
                                <>
                                  <span className="text-slate-500">Giroscopio</span>
                                  <span className="font-medium text-right">{phone.especificaciones.sensores.giroscopio}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Protecciones */}
                        {phone.especificaciones.protecciones && (
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              Protecciones
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              {phone.especificaciones.protecciones.agua && (
                                <>
                                  <span className="text-slate-500">Agua</span>
                                  <span className="font-medium text-right">{phone.especificaciones.protecciones.agua}</span>
                                </>
                              )}
                              {phone.especificaciones.protecciones.polvo && (
                                <>
                                  <span className="text-slate-500">Polvo</span>
                                  <span className="font-medium text-right">{phone.especificaciones.protecciones.polvo}</span>
                                </>
                              )}
                              {phone.especificaciones.protecciones.ip_rating && (
                                <>
                                  <span className="text-slate-500">Clasificación IP</span>
                                  <span className="font-medium text-right">{phone.especificaciones.protecciones.ip_rating}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}



              {/* Usage Tags Explained - Educational */}
              {phone.tags.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-center">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    ¿Para qué sirve este celular?
                  </h2>
                  <div className="space-y-3">
                    {phone.tags.map((tag) => {
                      const tagInfo = TAG_LABELS[tag.nombre]
                      const label = tagInfo ? tagInfo.label : tag.nombre
                      const description = TAG_DESCRIPTIONS[tag.nombre] || tag.descripcion
                      
                      let badgeStyle = {}
                      let badgeClass = "flex-shrink-0 mt-0.5 font-semibold"
                      
                      if (tag.color) {
                         badgeStyle = { backgroundColor: tag.color, color: '#ffffff' }
                      } else if (tagInfo) {
                         badgeClass = `${tagInfo.color} ${badgeClass}`
                      } else {
                         badgeClass = `bg-slate-100 text-slate-700 ${badgeClass}`
                      }

                      return description ? (
                        <div
                          key={tag.id}
                          className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
                        >
                          <Badge 
                            className={badgeClass}
                            style={badgeStyle}
                          >
                            {label}
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

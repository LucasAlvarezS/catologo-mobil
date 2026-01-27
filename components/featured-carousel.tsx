"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TelefonoWithTags } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Zap } from "lucide-react"

export function FeaturedCarousel({ phones }: { phones: TelefonoWithTags[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  if (!phones.length) return null

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-12 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-yellow-500 rounded-full p-1.5">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Ofertas Imperdibles</h2>
      </div>
      
      <div className="relative group">
        <div className="overflow-hidden rounded-3xl shadow-2xl bg-white ring-1 ring-slate-900/5" ref={emblaRef}>
          <div className="flex">
            {phones.map((phone) => {
               const price = phone.precio_portabilidad || phone.precio_lista
               const originalPrice = phone.precio_lista > price ? phone.precio_lista : null
               
               return (
                <div className="flex-[0_0_100%] min-w-0" key={phone.id}>
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 items-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white h-full min-h-[450px] relative overflow-hidden">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="order-2 md:order-1 space-y-6 md:space-y-8 relative z-10">
                      <div className="space-y-4">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none px-4 py-1.5 text-sm font-bold shadow-lg shadow-yellow-500/20">
                          MEJOR PRECIO
                        </Badge>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                          {phone.marca} <span className="text-indigo-400">{phone.modelo}</span>
                        </h3>
                        <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed">
                          {phone.descripcion_corta}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest ">Precio Oferta</p>
                        <div className="flex items-end gap-4 flex-wrap">
                           <span className="text-4xl md:text-6xl font-bold text-white tracking-tight">{formatPrice(price)}</span>
                           {originalPrice && (
                             <div className="flex flex-col mb-1.5">
                               <span className="text-sm text-slate-400 font-medium line-through">{formatPrice(originalPrice)}</span>
                               <span className="text-xs text-green-400 font-bold">Ahorras {formatPrice(originalPrice - price)}</span>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <Button asChild size="lg" className="bg-white text-indigo-950 hover:bg-slate-100 font-bold border-none rounded-full px-8 h-12 md:h-14 text-base md:text-lg shadow-xl shadow-white/10 transition-transform hover:-translate-y-1">
                          <Link href={`/telefono/${phone.id}`}>
                            Ver Oferta
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="order-1 md:order-2 flex justify-center items-center relative h-[300px] md:h-[450px] z-10">
                       <div className="relative w-full h-full max-w-[400px]">
                         <Image
                           src={phone.foto_url || "/placeholder.svg"}
                           alt={phone.modelo}
                           fill
                           className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                           priority
                           style={{ transform: "rotate(-5deg)" }}
                         />
                       </div>
                    </div>
                  </div>
                </div>
               )
            })}
          </div>
        </div>
        
        <button
           className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
           onClick={() => emblaApi?.scrollPrev()}
           aria-label="Anterior"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        
        <button
           className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
           onClick={() => emblaApi?.scrollNext()}
           aria-label="Siguiente"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  )
}

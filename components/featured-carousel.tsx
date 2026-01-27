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
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Timer } from "lucide-react"

export function FeaturedCarousel({ phones }: { phones: TelefonoWithTags[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  )

  if (!phones.length) return null

  // If there are few phones, duplicate them to ensure infinite loop visual effect works well
  const displayPhones = phones.length < 5 ? [...phones, ...phones, ...phones] : phones

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 overflow-hidden py-4">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="bg-amber-500 rounded-full p-1.5 animate-pulse">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Oportunidades Flash</h2>
      </div>
      
      <div className="relative" ref={emblaRef}>
        <div className="flex -ml-4">
          {displayPhones.map((phone, index) => {
               const price = phone.precio_portabilidad || phone.precio_lista
               const originalPrice = phone.precio_lista > price ? phone.precio_lista : null
               
               return (
                <div className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] min-w-0 pl-4" key={`${phone.id}-${index}`}>
                  <Link href={`/telefono/${phone.id}`} className="block group relative transform transition-all duration-500 hover:scale-105">
                    <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden border border-slate-100 ring-1 ring-slate-900/5 h-[160px]">
                      
                      {/* Image Section - Gradient Background */}
                      <div className="w-[35%] bg-gradient-to-br from-indigo-50 to-blue-50 relative flex items-center justify-center p-2">
                        <div className="relative w-full h-full">
                           <Image
                            src={phone.foto_url || "/placeholder.svg"}
                            alt={phone.modelo}
                            fill
                            className="object-contain mix-blend-multiply p-2 transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        {phone.precio_portabilidad && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            PORTA
                          </div>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="flex-1 p-4 flex flex-col justify-center min-w-0 relative">
                        {/* Decorative background blur on side */}
                        <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-200/50 transition-colors" />
                        
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{phone.marca}</p>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight truncate mb-2">{phone.modelo}</h3>
                        
                        <div className="mt-auto space-y-0.5">
                           {originalPrice && (
                             <div className="flex items-center gap-2">
                               <span className="text-xs text-slate-400 line-through decoration-slate-400/50">{formatPrice(originalPrice)}</span>
                               <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded-full border border-green-100">
                                 -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                               </span>
                             </div>
                           )}
                           <div className="flex items-center gap-2 relative z-10">
                             <p className="text-2xl font-black text-slate-900 tracking-tight">{formatPrice(price)}</p>
                           </div>
                        </div>

                        <div className="absolute bottom-4 right-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Active/Inactive Mask Overlay effect managed via CSS in global or just opacity here if possible, 
                        but standard Embla loop usually keeps all visible. 
                        We add a white overlay that fades out on hover to simulate focus on the one being looked at. 
                    */}
                    <div className="absolute inset-0 bg-white/40 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-0" />
                  </Link>
                </div>
               )
            })}
        </div>
      </div>
      
      {/* Visual indicator of "more content" on sides is achieved by the flex-basis percentages showing partial slides */}
    </div>
  )
}

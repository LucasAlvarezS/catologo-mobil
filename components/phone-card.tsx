import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { type TelefonoWithTags, TAG_LABELS } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface PhoneCardProps {
  phone: TelefonoWithTags
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const hasDiscount = phone.precio_descuento && phone.precio_descuento < phone.precio_lista
  const hasPlanPrice = phone.precio_plan && phone.precio_plan < phone.precio_lista
  const discountPercent = hasDiscount ? Math.round(((phone.precio_lista - phone.precio_descuento!) / phone.precio_lista) * 100) : 0

  return (
    <Link href={`/telefono/${phone.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:border-blue-400">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-b">
          <Image
            src={phone.foto_url || "/placeholder.svg?height=300&width=300&query=smartphone"}
            alt={`${phone.marca} ${phone.modelo}`}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercent}%
            </div>
          )}
          
          {/* Stock indicator */}
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            En stock
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Brand & Model */}
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{phone.marca}</p>
            <h3 className="font-bold text-base text-slate-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {phone.modelo}
            </h3>
          </div>

          {/* Price Section */}
          <div className="space-y-1 bg-blue-50 -mx-4 px-4 py-3 rounded-lg">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">{formatPrice(phone.precio_descuento!)}</span>
                <span className="text-sm text-slate-500 line-through">{formatPrice(phone.precio_lista)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-slate-900">{formatPrice(phone.precio_lista)}</span>
            )}
            {hasPlanPrice && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Con plan: {formatPrice(phone.precio_plan!)}
              </p>
            )}
            <p className="text-xs text-slate-500 font-medium pt-1">IVA incluido</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {phone.tags.slice(0, 2).map((tag) => {
              const tagInfo = TAG_LABELS[tag.nombre]
              return tagInfo ? (
                <Badge key={tag.id} className={`text-xs font-semibold ${tagInfo.color} hover:scale-105 transition-transform`}>
                  {tagInfo.label}
                </Badge>
              ) : null
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

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

  return (
    <Link href={`/telefono/${phone.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={phone.foto_url || "/placeholder.svg?height=300&width=300&query=smartphone"}
            alt={`${phone.marca} ${phone.modelo}`}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && <Badge className="absolute top-2 right-2 bg-red-500 text-white">Oferta</Badge>}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{phone.marca}</p>
          <h3 className="font-semibold text-foreground mt-1 line-clamp-1">{phone.modelo}</h3>

          <div className="mt-2 space-y-1">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{formatPrice(phone.precio_descuento!)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(phone.precio_lista)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-foreground">{formatPrice(phone.precio_lista)}</span>
            )}
            {hasPlanPrice && (
              <p className="text-xs text-emerald-600 font-medium">Con plan: {formatPrice(phone.precio_plan!)}</p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {phone.tags.slice(0, 3).map((tag) => {
              const tagInfo = TAG_LABELS[tag.nombre]
              return tagInfo ? (
                <Badge key={tag.id} variant="secondary" className={`text-xs ${tagInfo.color}`}>
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

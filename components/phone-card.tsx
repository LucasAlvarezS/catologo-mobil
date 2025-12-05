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
  
  // Plan logic
  const minPlanPrice = phone.planes && phone.planes.length > 0
    ? Math.min(...phone.planes.map(p => Number(p.precio_mensual)))
    : (phone.precio_mensual_plan || 0)
    
  const hasPlan = phone.incluye_plan && minPlanPrice > 0
  const multiplePlans = phone.planes && phone.planes.length > 1

  return (
    <Link href={`/telefono/${phone.id}`} className="block h-full">
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-primary/10 hover:border-primary/30 h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <Image
            src={phone.foto_url || "/placeholder.svg?height=300&width=300&query=smartphone"}
            alt={`${phone.marca} ${phone.modelo}`}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          />
          {hasPlan && (
            <Badge className="absolute top-2 right-2 bg-emerald-500 text-white shadow-sm">
              {multiplePlans ? "Planes Disponibles" : "Con Plan"}
            </Badge>
          )}
        </div>
        <CardContent className="p-5 text-center flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">{phone.marca}</p>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-3">{phone.modelo}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center min-h-[3rem]">
              {hasPlan ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-emerald-600">{formatPrice(phone.precio_plan || phone.precio_lista)}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Con Plan</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Plan desde {formatPrice(minPlanPrice)}/mes
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {hasDiscount ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-red-600">{formatPrice(phone.precio_descuento!)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatPrice(phone.precio_lista)}</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-slate-900">{formatPrice(phone.precio_lista)}</span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {phone.colores && phone.colores.length > 0 && (
                <div className="flex gap-1 items-center justify-center w-full mb-1">
                  {phone.colores.map((color, i) => (
                    <div
                      key={`${color.nombre}-${i}`}
                      className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.nombre}
                    />
                  ))}
                </div>
              )}
              {phone.tags.slice(0, 3).map((tag) => {
                const tagInfo = TAG_LABELS[tag.nombre]
                const label = tagInfo ? tagInfo.label : tag.nombre
                const colorStyle = tag.color ? { backgroundColor: tag.color, color: '#ffffff' } : undefined
                
                let colorClass = "bg-slate-100 text-slate-700"
                if (tag.color) {
                  colorClass = ""
                } else if (tagInfo) {
                  colorClass = tagInfo.color
                }

                return (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className={`text-[10px] px-2 py-0.5 ${colorClass}`}
                    style={colorStyle}
                  >
                    {label}
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
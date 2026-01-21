import { Phone, Wifi, Globe, Facebook, Instagram, Twitter, MessageCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanCardProps {
  plan: {
    nombre: string
    gigas: string
    precio_mensual: number
    precio_mensual_normal: number
    meses_promocion: number
    redes_sociales?: string[]
    linea_adicional?: boolean
    descripcion?: string
  }
  isSelected?: boolean
  onClick?: () => void
}

const SOCIAL_ICONS: Record<string, any> = {
  Facebook: Facebook,
  Instagram: Instagram,
  X: Twitter,
  WhatsApp: Phone, // Using Phone icon for WhatsApp as fallback or specific icon if available
  Messenger: MessageCircle,
  Telegram: Send
}

export function PlanCard({ plan, isSelected, onClick }: PlanCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative w-full max-w-[280px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105",
        "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl",
        isSelected ? "ring-4 ring-blue-600 scale-105" : "opacity-90 hover:opacity-100"
      )}
    >
      {/* Header */}
      <div className="bg-blue-800/30 p-4 text-center">
        <h3 className="text-2xl font-black tracking-wider uppercase">PLAN {plan.nombre}</h3>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col items-center space-y-6">
        
        {/* Gigas Section */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-8 h-8" />
            <span className="text-5xl font-black">{plan.gigas.replace(/\D/g, '')}</span>
          </div>
          <p className="text-xl font-bold tracking-widest">GIGAS</p>
        </div>

        {/* Social Media Icons */}
        {plan.redes_sociales && plan.redes_sociales.length > 0 && (
          <div className="flex gap-2 justify-center w-full py-3 border-y border-white/20 flex-wrap">
              {plan.redes_sociales.map((network) => {
                const Icon = SOCIAL_ICONS[network]
                if (!Icon) return null
                return (
                  <div key={network} className="p-1.5 bg-white rounded-full text-blue-600" title={network}>
                    <Icon className="w-4 h-4" />
                  </div>
                )
              })}
          </div>
        )}

        {/* Minutes */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Phone className="w-6 h-6 fill-current" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg leading-none">MINUTOS</p>
            <p className="font-medium text-sm opacity-90">LIBRES</p>
            <p className="text-[10px] opacity-75 leading-tight mt-0.5">solo a 300 números diferentes por mes</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-xs opacity-80 px-2">
          {plan.descripcion || "Navegación de alta velocidad en la red más rápida"}
        </p>

        {/* Additional Line Info */}
        {plan.linea_adicional && (
          <div className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-center backdrop-blur-sm mt-2">
             <div className="flex items-center justify-center gap-1 mb-1">
               <Phone className="w-3 h-3 text-white fill-current" />
               <p className="text-xs font-bold text-white uppercase tracking-wider">
                 + Línea Adicional
               </p>
             </div>
             <p className="text-[10px] text-blue-100 leading-tight">
               Porta líneas extra por $4.900
             </p>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-4 text-center w-full">
          <div className="bg-white text-blue-600 py-2 px-6 rounded-full font-black text-2xl shadow-lg transform hover:scale-105 transition-transform">
            {formatPrice(plan.precio_mensual)}
          </div>
          {plan.meses_promocion > 0 && (
             <p className="text-[10px] mt-2 opacity-90">
               Por {plan.meses_promocion} meses, luego {formatPrice(plan.precio_mensual_normal)}
             </p>
          )}
        </div>

      </div>
    </div>
  )
}


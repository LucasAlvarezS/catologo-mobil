import { PhoneCard } from "@/components/phone-card"
import type { TelefonoWithTags } from "@/lib/types"

interface PhoneGridProps {
  phones: TelefonoWithTags[]
}

export function PhoneGrid({ phones }: PhoneGridProps) {
  if (phones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-lg">No se encontraron teléfonos con los filtros seleccionados.</p>
        <p className="text-sm text-muted-foreground mt-2">Intenta cambiar los filtros o buscar otro modelo.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {phones.map((phone) => (
        <PhoneCard key={phone.id} phone={phone} />
      ))}
    </div>
  )
}

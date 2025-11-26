import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `$${formattedPrice}`;
}



export function generateWhatsAppLink(modelo: string, marca: string): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5215512345678"
  const message = encodeURIComponent(`Hola, vi el modelo ${marca} ${modelo} en tu catálogo y quisiera más información.`)
  return `https://wa.me/${phoneNumber}?text=${message}`
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/[\s\u00A0]/g, "") // Remove spaces to ensure $1.099.999 format
}

export function generateWhatsAppLink(modelo: string, marca: string): string {
  const phoneNumber = "5215512345678" // Replace with actual store phone number
  const message = encodeURIComponent(`Hola, vi el modelo ${marca} ${modelo} en tu catálogo y quisiera más información.`)
  return `https://wa.me/${phoneNumber}?text=${message}`
}

"use client"

import { X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import type { Telefono } from "@/lib/types"

interface PhoneComparisonProps {
  phones: Telefono[]
  onClose: () => void
}

export function PhoneComparison({ phones, onClose }: PhoneComparisonProps) {
  if (phones.length === 0) {
    return null
  }

  const specs = [
    { key: "precio_lista", label: "💰 Precio Lista", format: (v: any) => formatPrice(v), type: "price" },
    { key: "precio_plan", label: "📱 Precio con Plan", format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "precio_descuento", label: "🎁 Precio Descuento", format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "ram", label: "⚡ RAM", format: (v: any) => v || "-", type: "spec" },
    { key: "almacenamiento", label: "💾 Almacenamiento", format: (v: any) => v || "-", type: "spec" },
    { key: "procesador", label: "🔧 Procesador", format: (v: any) => v || "-", type: "spec" },
    { key: "bateria", label: "🔋 Batería", format: (v: any) => v || "-", type: "spec" },
    { key: "camara", label: "📷 Cámara", format: (v: any) => v || "-", type: "spec" },
    { key: "pantalla", label: "📺 Pantalla", format: (v: any) => v || "-", type: "spec" },
  ]

  // Helper to determine best value for each spec
  const getBestValue = (spec: any) => {
    const values = phones
      .map((p) => p[spec.key as keyof Telefono])
      .filter((v) => v !== null && v !== undefined)

    if (spec.type === "price") {
      // Lowest price is best
      return Math.min(...(values as number[]))
    }
    // For specs, we can't really determine "best" without parsing, so return null
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-auto">
      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Comparar Teléfonos</h2>
            <p className="text-blue-100">Analiza las diferencias lado a lado para tomar la mejor decisión</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
                  <th className="px-6 py-4 text-left font-bold text-lg">Especificación</th>
                  {phones.map((phone) => (
                    <th key={phone.id} className="px-6 py-4 text-center font-bold min-w-56">
                      <div className="space-y-3">
                        {phone.foto_url && (
                          <div className="flex justify-center">
                            <div className="relative w-32 h-40 bg-white/10 rounded-lg p-2">
                              <Image
                                src={phone.foto_url}
                                alt={phone.modelo}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lg">{phone.marca}</p>
                          <p className="text-sm text-blue-100">{phone.modelo}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {specs.map((spec, idx) => {
                  const bestValue = getBestValue(spec)
                  return (
                    <tr
                      key={spec.key}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 sticky left-0 bg-inherit z-10">
                        {spec.label}
                      </td>
                      {phones.map((phone) => {
                        const value = phone[spec.key as keyof Telefono]
                        const isBest =
                          bestValue !== null &&
                          spec.type === "price" &&
                          value === bestValue
                        return (
                          <td
                            key={`${phone.id}-${spec.key}`}
                            className={`px-6 py-4 text-center font-semibold text-lg border-l border-slate-200 ${
                              isBest
                                ? "bg-green-50 text-green-800"
                                : "text-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {spec.format(value)}
                              {isBest && (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {phones.map((phone) => (
            <div key={phone.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                {phone.foto_url && (
                  <div className="flex justify-center mb-3">
                    <div className="relative w-24 h-32 bg-white/20 rounded-lg p-2">
                      <Image
                        src={phone.foto_url}
                        alt={phone.modelo}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                <p className="font-bold text-lg">{phone.marca}</p>
                <p className="text-sm text-blue-100">{phone.modelo}</p>
              </div>

              {/* Specs */}
              <div className="p-4 space-y-3">
                {specs.map((spec) => (
                  <div
                    key={spec.key}
                    className="flex justify-between items-center pb-3 border-b border-slate-200 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-slate-700">{spec.label}</span>
                    <span className="font-bold text-slate-900 text-right max-w-xs">
                      {spec.format(phone[spec.key as keyof Telefono])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold"
          >
            Cerrar Comparación
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Consejo:</span> Los valores destacados en verde indican el precio más competitivo. Para elegir, considera el precio, especificaciones y para qué lo vas a usar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

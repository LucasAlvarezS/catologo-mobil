"use client"

import { useState } from "react"
import { X, Check, Sparkles, Loader2, DollarSign, Smartphone, Gift, Zap, HardDrive, Cpu, Battery, Camera, Monitor, Lightbulb, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import type { Telefono } from "@/lib/types"
import { comparePhonesWithAI } from "@/app/actions"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface PhoneComparisonProps {
  phones: Telefono[]
  onClose: () => void
}

export function PhoneComparison({ phones, onClose }: Readonly<PhoneComparisonProps>) {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  if (phones.length === 0) {
    return null
  }

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true)
    const result = await comparePhonesWithAI(phones)
    if (result.success && result.text) {
      setAiAnalysis(result.text)
    }
    setIsAnalyzing(false)
  }

  const specs = [
    { key: "precio_portabilidad", label: <><ArrowLeftRight className="w-4 h-4 inline mr-2" /> Precio Portabilidad</>, format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "precio_tarjeta_hites", label: <><DollarSign className="w-4 h-4 inline mr-2" /> Precio Hites</>, format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "precio_plan", label: <><Smartphone className="w-4 h-4 inline mr-2" /> Precio con Plan</>, format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "precio_lista", label: <><DollarSign className="w-4 h-4 inline mr-2" /> Precio Lista</>, format: (v: any) => formatPrice(v), type: "price" },
    { key: "precio_descuento", label: <><Gift className="w-4 h-4 inline mr-2" /> Precio Descuento</>, format: (v: any) => (v ? formatPrice(v) : "-"), type: "price" },
    { key: "ram", label: <><Zap className="w-4 h-4 inline mr-2" /> RAM</>, format: (v: any) => v || "-", type: "spec" },
    { key: "almacenamiento", label: <><HardDrive className="w-4 h-4 inline mr-2" /> Almacenamiento</>, format: (v: any) => v || "-", type: "spec" },
    { key: "procesador", label: <><Cpu className="w-4 h-4 inline mr-2" /> Procesador</>, format: (v: any) => v || "-", type: "spec" },
    { key: "bateria", label: <><Battery className="w-4 h-4 inline mr-2" /> Batería</>, format: (v: any) => v || "-", type: "spec" },
    { key: "camara", label: <><Camera className="w-4 h-4 inline mr-2" /> Cámara</>, format: (v: any) => v || "-", type: "spec" },
    { key: "pantalla", label: <><Monitor className="w-4 h-4 inline mr-2" /> Pantalla</>, format: (v: any) => v || "-", type: "spec" },
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="container max-w-6xl w-full py-8">
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 text-center">
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
        <div className="flex flex-col items-center gap-4 mt-8">
          {!aiAnalysis && (
            <Button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all w-full max-w-md"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generar Análisis Inteligente
                </>
              )}
            </Button>
          )}

          {aiAnalysis && (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-blue-600 to-red-600 p-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <h3 className="text-xl font-bold text-white">Análisis Comparativo IA</h3>
              </div>
              <div className="p-6 prose prose-slate max-w-none prose-headings:text-blue-900 prose-strong:text-blue-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-2 rounded-lg font-semibold backdrop-blur-sm"
          >
            Cerrar Comparación
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Consejo:</span> Los valores destacados en verde indican el precio más competitivo. Para elegir, considera el precio, especificaciones y para qué lo vas a usar.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

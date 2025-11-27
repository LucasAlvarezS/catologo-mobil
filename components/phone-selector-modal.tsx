"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { TelefonoWithTags } from "@/lib/types"

interface PhoneSelectorModalProps {
  phones: TelefonoWithTags[]
  currentPhoneId: string
  onSelect: (selectedIds: string[]) => void
  onClose: () => void
}

export function PhoneSelectorModal({
  phones,
  currentPhoneId,
  onSelect,
  onClose,
}: PhoneSelectorModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set([currentPhoneId]))

  const togglePhone = (phoneId: string) => {
    const newSelected = new Set(selected)
    if (phoneId === currentPhoneId) {
      // No permitir deseleccionar el teléfono actual
      return
    }

    if (newSelected.has(phoneId)) {
      newSelected.delete(phoneId)
    } else {
      // Máximo 4 teléfonos para comparar
      if (newSelected.size < 4) {
        newSelected.add(phoneId)
      }
    }
    setSelected(newSelected)
  }

  const handleCompare = () => {
    if (selected.size >= 2) {
      onSelect(Array.from(selected))
      onClose()
    }
  }

  const otherPhones = phones.filter((p) => p.id !== currentPhoneId)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto flex">
      <div className="w-full max-w-4xl px-4 py-8 mx-auto my-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Selecciona equipos para comparar
              </h2>
              <p className="text-blue-100">
                Elige de 1 a 3 teléfonos adicionales para compararlos con {phones.find((p) => p.id === currentPhoneId)?.modelo}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Grid de Teléfonos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Teléfono Actual (siempre seleccionado) */}
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked disabled className="cursor-not-allowed" />
                  <span className="font-semibold text-sm">En tu comparación (seleccionado)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Array.from(selected).map((id) => {
                    const phone = phones.find((p) => p.id === id)
                    return (
                      phone && (
                        <div
                          key={id}
                          className="bg-white/10 rounded p-3 text-center border border-white/20"
                        >
                          {phone.foto_url && (
                            <div className="relative h-20 mb-2">
                              <Image
                                src={phone.foto_url}
                                alt={phone.modelo}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <p className="text-xs font-semibold">{phone.modelo}</p>
                          <p className="text-xs">{formatPrice(phone.precio_lista)}</p>
                        </div>
                      )
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Grid de Otros Teléfonos */}
            {otherPhones.map((phone) => (
              <Card
                key={phone.id}
                className={`cursor-pointer transition-all ${
                  selected.has(phone.id)
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:shadow-lg"
                } ${
                  selected.size >= 4 && !selected.has(phone.id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => togglePhone(phone.id)}
              >
                <div className="p-4">
                  {/* Checkbox */}
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      checked={selected.has(phone.id)}
                      disabled={selected.size >= 4 && !selected.has(phone.id)}
                      onChange={() => togglePhone(phone.id)}
                    />
                  </div>

                  {/* Imagen */}
                  {phone.foto_url && (
                    <div className="relative h-40 mb-3 bg-gray-100 rounded">
                      <Image
                        src={phone.foto_url}
                        alt={phone.modelo}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-gray-900">{phone.marca}</h3>
                    <p className="font-semibold text-base text-gray-800">{phone.modelo}</p>

                    {/* Precios */}
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(phone.precio_lista)}
                      </p>
                      {phone.precio_descuento && phone.precio_descuento < phone.precio_lista && (
                        <p className="text-sm text-green-600 font-semibold">
                          Con descuento: {formatPrice(phone.precio_descuento)}
                        </p>
                      )}
                    </div>

                    {/* Specs Breve */}
                    <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
                      {phone.ram && <p>📱 {phone.ram} RAM</p>}
                      {phone.almacenamiento && <p>💾 {phone.almacenamiento}</p>}
                      {phone.camara && <p>📷 {phone.camara}</p>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Información y Botones */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selected.size === 1
                    ? "Selecciona al menos 1 equipo más para comparar"
                    : `${selected.size} teléfono(s) seleccionado(s)`}
                </h3>
                <p className="text-sm text-gray-600">
                  Puedes comparar hasta 4 equipos. Nuestro asistente IA analizará lo mejor de cada
                  uno y te recomendará cuál es el mejor según tus necesidades.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose} className="px-6">
                Cancelar
              </Button>
              <Button
                onClick={handleCompare}
                disabled={selected.size < 2}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold"
              >
                Comparar ({selected.size})
              </Button>
            </div>
          </div>
      </div>
    </div>
  )
}

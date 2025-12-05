"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { TelefonoWithTags } from "@/lib/types"

interface PhoneSelectorModalProps {
  phones: TelefonoWithTags[]
  currentPhoneId: string
  onSelect: (selectedIds: string[]) => void
  onClose: () => void
}

export function PhoneSelectorModal({ phones, currentPhoneId, onSelect, onClose }: PhoneSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([currentPhoneId])

  const filteredPhones = phones.filter(
    (phone) =>
      phone.id !== currentPhoneId &&
      (phone.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.marca.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleToggle = (phoneId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(phoneId)) {
        return prev.filter((id) => id !== phoneId)
      }
      if (prev.length >= 3) {
        return prev // Max 3 phones
      }
      return [...prev, phoneId]
    })
  }

  const handleConfirm = () => {
    onSelect(selectedIds)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Seleccionar para comparar</h2>
            <p className="text-sm text-slate-500 mt-1">
              Elige hasta 2 equipos adicionales ({selectedIds.length}/3)
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-200 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por marca o modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPhones.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No se encontraron teléfonos</p>
            </div>
          ) : (
            filteredPhones.map((phone) => {
              const isSelected = selectedIds.includes(phone.id)
              const isDisabled = !isSelected && selectedIds.length >= 3

              return (
                <div
                  key={phone.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isDisabled && handleToggle(phone.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => !isDisabled && handleToggle(phone.id)}
                    disabled={isDisabled}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  
                  <div className="relative w-12 h-16 bg-white rounded-lg border border-slate-100 p-1 flex-shrink-0">
                    <Image
                      src={phone.foto_url || "/placeholder.svg"}
                      alt={phone.modelo}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 truncate">{phone.modelo}</p>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">
                        {phone.marca}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span>{phone.ram} RAM</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{phone.almacenamiento}</span>
                    </div>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      {formatPrice(phone.precio_descuento || phone.precio_lista)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={selectedIds.length < 2}
          >
            Comparar ({selectedIds.length})
          </Button>
        </div>
      </div>
    </div>
  )
}

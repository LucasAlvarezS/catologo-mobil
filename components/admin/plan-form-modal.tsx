"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Plan {
  id?: string
  nombre: string
  gigas: string
  precio_mensual: number
  precio_mensual_normal: number
  meses_promocion: number
}

interface PlanFormModalProps {
  isOpen: boolean
  onClose: () => void
  planToEdit?: Plan | null
  onSuccess: () => void
}

export function PlanFormModal({ isOpen, onClose, planToEdit, onSuccess }: PlanFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Plan>({
    nombre: "",
    gigas: "",
    precio_mensual: 0,
    precio_mensual_normal: 0,
    meses_promocion: 0,
  })
  const [hasPromoMonths, setHasPromoMonths] = useState(false)

  useEffect(() => {
    if (planToEdit) {
      setFormData(planToEdit)
      setHasPromoMonths(planToEdit.meses_promocion > 0)
    } else {
      setFormData({
        nombre: "",
        gigas: "",
        precio_mensual: 0,
        precio_mensual_normal: 0,
        meses_promocion: 0,
      })
      setHasPromoMonths(false)
    }
  }, [planToEdit, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("precio") || name === "meses_promocion" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const dataToSave = {
      ...formData,
      meses_promocion: hasPromoMonths ? formData.meses_promocion : 0
    }

    try {
      if (planToEdit?.id) {
        const { error } = await supabase
          .from("planes")
          .update(dataToSave)
          .eq("id", planToEdit.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("planes")
          .insert(dataToSave)
        if (error) throw error
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{planToEdit ? "Editar Plan" : "Nuevo Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del Plan</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Plan MAX L LIBRE"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gigas">Gigas</Label>
            <Input
              id="gigas"
              name="gigas"
              value={formData.gigas}
              onChange={handleChange}
              placeholder="300GB"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="precio_mensual">Precio Oferta</Label>
              <Input
                id="precio_mensual"
                name="precio_mensual"
                type="number"
                value={formData.precio_mensual}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio_mensual_normal">Precio Normal</Label>
              <Input
                id="precio_mensual_normal"
                name="precio_mensual_normal"
                type="number"
                value={formData.precio_mensual_normal}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="has_promo">¿Tiene Meses Promoción?</Label>
              <Switch
                id="has_promo"
                checked={hasPromoMonths}
                onCheckedChange={setHasPromoMonths}
              />
            </div>
            {hasPromoMonths && (
              <div className="grid gap-2">
                <Label htmlFor="meses_promocion">Cantidad de Meses</Label>
                <Input
                  id="meses_promocion"
                  name="meses_promocion"
                  type="number"
                  value={formData.meses_promocion}
                  onChange={handleChange}
                  placeholder="6"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

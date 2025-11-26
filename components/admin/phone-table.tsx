"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import type { Telefono } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface PhoneTableProps {
  phones: Telefono[]
}

export function PhoneTable({ phones: initialPhones }: PhoneTableProps) {
  const router = useRouter()
  const [phones, setPhones] = useState(initialPhones)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState("")

  const toggleActive = async (id: string, currentState: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("telefonos").update({ activo: !currentState }).eq("id", id)

    if (!error) {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !currentState } : p)))
    }
  }

  const updatePrice = async (id: string) => {
    const supabase = createClient()
    const newPrice = Number.parseFloat(tempPrice)

    if (isNaN(newPrice) || newPrice < 0) {
      setEditingPrice(null)
      return
    }

    const { error } = await supabase.from("telefonos").update({ precio_lista: newPrice }).eq("id", id)

    if (!error) {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, precio_lista: newPrice } : p)))
    }
    setEditingPrice(null)
  }

  const deletePhone = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("telefonos").delete().eq("id", id)

    if (!error) {
      setPhones((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  if (phones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No hay teléfonos registrados. Agrega el primero.</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {phones.map((phone) => (
            <TableRow key={phone.id}>
              <TableCell className="font-medium">{phone.marca}</TableCell>
              <TableCell>{phone.modelo}</TableCell>
              <TableCell>
                {editingPrice === phone.id ? (
                  <Input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    onBlur={() => updatePrice(phone.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updatePrice(phone.id)
                      if (e.key === "Escape") setEditingPrice(null)
                    }}
                    className="w-28"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditingPrice(phone.id)
                      setTempPrice(phone.precio_lista.toString())
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    {formatPrice(phone.precio_lista)}
                  </button>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch checked={phone.activo} onCheckedChange={() => toggleActive(phone.id, phone.activo)} />
                  <Badge variant={phone.activo ? "default" : "secondary"}>{phone.activo ? "Visible" : "Oculto"}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/telefonos/${phone.id}`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar teléfono?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará {phone.marca} {phone.modelo} del catálogo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePhone(phone.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

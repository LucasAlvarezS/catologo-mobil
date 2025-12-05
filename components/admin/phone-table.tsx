"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Pencil, Trash2, Search } from "lucide-react"
import type { Telefono } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { deletePhoneAction, togglePhoneActiveAction, updatePhonePriceAction } from "@/app/actions"
import { toast } from "sonner"

interface PhoneTableProps {
  phones: Telefono[]
}

export function PhoneTable({ phones: initialPhones }: PhoneTableProps) {
  const router = useRouter()
  const [phones, setPhones] = useState(initialPhones)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("")

  const filteredPhones = phones.filter((phone) => {
    const matchesSearch = phone.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = phone.marca.toLowerCase().includes(brandFilter.toLowerCase())
    return matchesSearch && matchesBrand
  })

  const toggleActive = async (id: string, currentState: boolean) => {
    const result = await togglePhoneActiveAction(id, currentState)

    if (result.success) {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !currentState } : p)))
      toast.success("Estado actualizado")
    } else {
      toast.error("Error al actualizar estado")
    }
  }

  const updatePrice = async (id: string) => {
    const newPrice = Number.parseFloat(tempPrice)

    if (isNaN(newPrice) || newPrice < 0) {
      setEditingPrice(null)
      return
    }

    const result = await updatePhonePriceAction(id, newPrice)

    if (result.success) {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, precio_lista: newPrice } : p)))
      toast.success("Precio actualizado")
    } else {
      toast.error("Error al actualizar precio")
    }
    setEditingPrice(null)
  }

  const deletePhone = async (id: string) => {
    const result = await deletePhoneAction(id)

    if (result.success) {
      setPhones((prev) => prev.filter((p) => p.id !== id))
      toast.success("Teléfono eliminado")
      router.refresh()
    } else {
      toast.error("Error al eliminar teléfono")
    }
  }

  if (phones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No hay teléfonos registrados. Agrega el primero.</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca..."
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
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
            {filteredPhones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              filteredPhones.map((phone) => (
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
                      <Badge variant={phone.activo ? "default" : "secondary"}>
                        {phone.activo ? "Visible" : "Oculto"}
                      </Badge>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

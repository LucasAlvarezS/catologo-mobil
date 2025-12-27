"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2, Plus, ArrowLeft, Tag as TagIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tag } from "@/lib/types"

export default function TagsManagerPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Tag>>({
    nombre: "",
    descripcion: "",
    color: "#000000"
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("nombre", { ascending: true })

    if (data) setTags(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingTag) {
        // Actualizar
        const { error } = await supabase
          .from("tags")
          .update(formData)
          .eq("id", editingTag.id)
        
        if (error) throw error
      } else {
        // Crear
        const { error } = await supabase
          .from("tags")
          .insert([formData])
        
        if (error) throw error
      }

      await fetchTags()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving tag:", error)
      alert("Error al guardar la categoría")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

    const { error } = await supabase.from("tags").delete().eq("id", id)
    
    if (error) {
        console.error("Error deleting tag:", error)
        alert("Error al eliminar la categoría. Puede que esté en uso.")
    } else {
        fetchTags()
    }
  }

  const openEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData(tag)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTag(null)
    setFormData({
      nombre: "",
      descripcion: "",
      color: "#000000"
    })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gestión de Categorías (Tags)</h1>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTag ? "Editar Categoría" : "Crear Nueva Categoría"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nombre (ID interno)</Label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="ej: gaming_pesado"
                />
                <p className="text-xs text-slate-500">Usado para lógica interna (sin espacios, minúsculas)</p>
              </div>

              <div className="space-y-2">
                <Label>Descripción / Etiqueta Visible</Label>
                <Input 
                  value={formData.descripcion || ""} 
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="ej: Gaming Pro"
                />
              </div>

              <div className="space-y-2">
                <Label>Color del Badge</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        type="color"
                        value={formData.color || "#000000"} 
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                        value={formData.color || ""} 
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        placeholder="#000000"
                        className="font-mono"
                    />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-blue-600 text-white">Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre (ID)</TableHead>
              <TableHead>Etiqueta Visible</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.nombre}</TableCell>
                <TableCell>{tag.descripcion}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: tag.color || '#ccc' }}
                    />
                    <span className="text-xs font-mono text-slate-500">{tag.color}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(tag)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tags.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No hay categorías creadas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import type { Tag } from "@/lib/types"

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState({ nombre: "", descripcion: "" })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const { data, error } = await supabase.from("tags").select("*").order("nombre")
      if (error) throw error
      setTags(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!newTag.nombre.trim()) {
        setError("El nombre del tag es requerido")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("tags")
        .insert([{ nombre: newTag.nombre.trim(), descripcion: newTag.descripcion.trim() }])
        .select()

      if (error) throw error

      setTags([...tags, data[0]])
      setNewTag({ nombre: "", descripcion: "" })
      setSuccess("Tag agregado exitosamente")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este tag?")) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id)
      if (error) throw error

      setTags(tags.filter((t) => t.id !== id))
      setSuccess("Tag eliminado exitosamente")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Tags</h1>
          <p className="text-muted-foreground">Crea y administra las categorías de teléfonos</p>
        </div>
      </div>

      {/* Form para agregar nuevo tag */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Plus className="w-5 h-5" />
            Nuevo Tag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTag} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Tag *</Label>
                <Input
                  id="nombre"
                  placeholder="ej: Gama Alta, 5G, Gaming"
                  value={newTag.nombre}
                  onChange={(e) => setNewTag({ ...newTag, nombre: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción del tag..."
                  value={newTag.descripcion}
                  onChange={(e) => setNewTag({ ...newTag, descripcion: e.target.value })}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Agregando..." : "Agregar Tag"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags Disponibles ({tags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay tags creados aún</p>
          ) : (
            <div className="grid gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{tag.nombre}</p>
                    {tag.descripcion && (
                      <p className="text-sm text-muted-foreground">{tag.descripcion}</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

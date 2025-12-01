"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2 } from "lucide-react"
import { type TelefonoWithTags, type Tag, TAG_LABELS } from "@/lib/types"

interface PhoneFormProps {
  phone?: TelefonoWithTags
  tags: Tag[]
}

export function PhoneForm({ phone, tags }: PhoneFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    marca: phone?.marca || "",
    modelo: phone?.modelo || "",
    descripcion_corta: phone?.descripcion_corta || "",
    precio_lista: phone?.precio_lista?.toString() || "",
    precio_plan: phone?.precio_plan?.toString() || "",
    precio_descuento: phone?.precio_descuento?.toString() || "",
    ram: phone?.ram || "",
    almacenamiento: phone?.almacenamiento || "",
    procesador: phone?.procesador || "",
    bateria: phone?.bateria || "",
    camara: phone?.camara || "",
    pantalla: phone?.pantalla || "",
    foto_url: phone?.foto_url || "",
    foto_url_2: phone?.foto_url_2 || "",
    foto_url_3: phone?.foto_url_3 || "",
    activo: phone?.activo ?? true,
    stock: phone?.stock?.toString() || "0",
  })

  const [selectedTags, setSelectedTags] = useState<string[]>(phone?.tags?.map((t) => t.id) || [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const phoneData = {
      marca: formData.marca,
      modelo: formData.modelo,
      descripcion_corta: formData.descripcion_corta || null,
      precio_lista: Number.parseFloat(formData.precio_lista),
      precio_plan: formData.precio_plan ? Number.parseFloat(formData.precio_plan) : null,
      precio_descuento: formData.precio_descuento ? Number.parseFloat(formData.precio_descuento) : null,
      ram: formData.ram || null,
      almacenamiento: formData.almacenamiento || null,
      procesador: formData.procesador || null,
      bateria: formData.bateria || null,
      camara: formData.camara || null,
      pantalla: formData.pantalla || null,
      foto_url: formData.foto_url || null,
      foto_url_2: formData.foto_url_2 || null,
      foto_url_3: formData.foto_url_3 || null,
      activo: formData.activo,
      stock: Number.parseInt(formData.stock) || 0,
      updated_at: new Date().toISOString(),
    }

    try {
      let phoneId = phone?.id

      if (phone) {
        // Update existing phone
        const { error: updateError } = await supabase.from("telefonos").update(phoneData).eq("id", phone.id)

        if (updateError) throw updateError
      } else {
        // Create new phone
        const { data, error: insertError } = await supabase.from("telefonos").insert(phoneData).select("id").single()

        if (insertError) throw insertError
        phoneId = data.id
      }

      // Update tags
      if (phoneId) {
        // Remove existing tags
        await supabase.from("telefono_tags").delete().eq("telefono_id", phoneId)

        // Add selected tags
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map((tagId) => ({
            telefono_id: phoneId,
            tag_id: tagId,
          }))
          await supabase.from("telefono_tags").insert(tagInserts)
        }
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="marca">Marca *</Label>
            <Input
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              placeholder="Samsung, iPhone, Xiaomi..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modelo">Modelo *</Label>
            <Input
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              placeholder="Galaxy S24, 15 Pro..."
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="descripcion_corta">Descripción</Label>
            <Textarea
              id="descripcion_corta"
              name="descripcion_corta"
              value={formData.descripcion_corta}
              onChange={handleChange}
              placeholder="Breve descripción del teléfono..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Prices */}
      <Card>
        <CardHeader>
          <CardTitle>Precios</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="precio_lista">Precio Lista *</Label>
            <Input
              id="precio_lista"
              name="precio_lista"
              type="number"
              step="0.01"
              value={formData.precio_lista}
              onChange={handleChange}
              required
              placeholder="999.99"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="precio_plan">Precio con Plan</Label>
            <Input
              id="precio_plan"
              name="precio_plan"
              type="number"
              step="0.01"
              value={formData.precio_plan}
              onChange={handleChange}
              placeholder="799.99"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="precio_descuento">Precio Descuento</Label>
            <Input
              id="precio_descuento"
              name="precio_descuento"
              type="number"
              step="0.01"
              value={formData.precio_descuento}
              onChange={handleChange}
              placeholder="899.99"
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Especificaciones</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="ram">RAM</Label>
            <Input id="ram" name="ram" value={formData.ram} onChange={handleChange} placeholder="8GB" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="almacenamiento">Almacenamiento</Label>
            <Input
              id="almacenamiento"
              name="almacenamiento"
              value={formData.almacenamiento}
              onChange={handleChange}
              placeholder="256GB"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="procesador">Procesador</Label>
            <Input
              id="procesador"
              name="procesador"
              value={formData.procesador}
              onChange={handleChange}
              placeholder="Snapdragon 8 Gen 3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bateria">Batería</Label>
            <Input id="bateria" name="bateria" value={formData.bateria} onChange={handleChange} placeholder="5000mAh" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="camara">Cámara</Label>
            <Input
              id="camara"
              name="camara"
              value={formData.camara}
              onChange={handleChange}
              placeholder="50MP + 12MP + 10MP"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pantalla">Pantalla</Label>
            <Input
              id="pantalla"
              name="pantalla"
              value={formData.pantalla}
              onChange={handleChange}
              placeholder="6.7 AMOLED 120Hz"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="foto_url">URL Imagen Principal</Label>
            <Input
              id="foto_url"
              name="foto_url"
              value={formData.foto_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="foto_url_2">URL Imagen 2</Label>
              <Input
                id="foto_url_2"
                name="foto_url_2"
                value={formData.foto_url_2}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="foto_url_3">URL Imagen 3</Label>
              <Input
                id="foto_url_3"
                name="foto_url_3"
                value={formData.foto_url_3}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => {
              const tagInfo = TAG_LABELS[tag.nombre]
              return (
                <div
                  key={tag.id}
                  className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <Label htmlFor={tag.id} className="flex-1 cursor-pointer font-normal">
                    {tagInfo?.label || tag.nombre}
                  </Label>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Switch
            id="activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, activo: checked }))}
          />
          <Label htmlFor="activo" className="cursor-pointer">
            {formData.activo ? "Visible en catálogo" : "Oculto del catálogo"}
          </Label>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
          <Link href="/admin">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {phone ? "Guardar Cambios" : "Crear Teléfono"}
        </Button>
      </div>
    </form>
  )
}

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
import { ArrowLeft, Loader2, Plus, Trash2, Pencil } from "lucide-react"
import { type TelefonoWithTags, type Tag, type BoxContent, TAG_LABELS } from "@/lib/types"
import { ImageUpload } from "@/components/admin/image-upload"

interface PhoneFormProps {
  phone?: TelefonoWithTags
  tags: Tag[]
  boxContents: BoxContent[]
}

export function PhoneForm({ phone, tags, boxContents }: PhoneFormProps) {
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
    tiene_ram_virtual: phone?.tiene_ram_virtual ?? false,
    tiene_almacenamiento_expandible: phone?.tiene_almacenamiento_expandible ?? false,
    colores: phone?.colores || [],
    incluye_plan: phone?.incluye_plan ?? false,
    nombre_plan: phone?.nombre_plan || "Plan MAX L LIBRE",
    info_gigas_plan: phone?.info_gigas_plan || "300GB",
    precio_mensual_plan: phone?.precio_mensual_plan?.toString() || "7990",
    precio_mensual_plan_normal: phone?.precio_mensual_plan_normal?.toString() || "14990",
    meses_plan_promocional: phone?.meses_plan_promocional?.toString() || "6",
    planes: phone?.planes || (phone?.nombre_plan ? [{
      nombre: phone.nombre_plan,
      gigas: phone.info_gigas_plan || "",
      precio_mensual: phone.precio_mensual_plan || 0,
      precio_mensual_normal: phone.precio_mensual_plan_normal || 0,
      meses_promocion: phone.meses_plan_promocional || 0
    }] : []),
  })

  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#000000")

  const [newPlan, setNewPlan] = useState({
    nombre: "",
    gigas: "",
    precio_mensual: "",
    precio_mensual_normal: "",
    meses_promocion: "",
  })

  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null)

  const [selectedTags, setSelectedTags] = useState<string[]>(phone?.tags?.map((t) => t.id) || [])
  const [selectedBoxContents, setSelectedBoxContents] = useState<string[]>(phone?.box_contents?.map((bc) => bc.id) || [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const toggleBoxContent = (contentId: string) => {
    setSelectedBoxContents((prev) => (prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId]))
  }

  const handleAddColor = () => {
    if (!newColorName) return
    setFormData((prev) => ({
      ...prev,
      colores: [...(prev.colores || []), { nombre: newColorName, hex: newColorHex }],
    }))
    setNewColorName("")
    setNewColorHex("#000000")
  }

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colores: (prev.colores || []).filter((_, i) => i !== index),
    }))
  }

  const handleAddPlan = () => {
    if (!newPlan.nombre || !newPlan.precio_mensual) return

    const planData = {
      nombre: newPlan.nombre,
      gigas: newPlan.gigas,
      precio_mensual: Number(newPlan.precio_mensual),
      precio_mensual_normal: Number(newPlan.precio_mensual_normal),
      meses_promocion: Number(newPlan.meses_promocion),
    }

    if (editingPlanIndex !== null) {
      setFormData((prev) => {
        const updatedPlanes = [...(prev.planes || [])]
        updatedPlanes[editingPlanIndex] = planData
        return { ...prev, planes: updatedPlanes }
      })
      setEditingPlanIndex(null)
    } else {
      setFormData((prev) => ({
        ...prev,
        planes: [...(prev.planes || []), planData],
      }))
    }

    setNewPlan({
      nombre: "",
      gigas: "",
      precio_mensual: "",
      precio_mensual_normal: "",
      meses_promocion: "",
    })
  }

  const handleEditPlan = (index: number) => {
    const plan = formData.planes![index]
    setNewPlan({
      nombre: plan.nombre,
      gigas: plan.gigas,
      precio_mensual: plan.precio_mensual.toString(),
      precio_mensual_normal: plan.precio_mensual_normal.toString(),
      meses_promocion: plan.meses_promocion.toString(),
    })
    setEditingPlanIndex(index)
  }

  const handleRemovePlan = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      planes: (prev.planes || []).filter((_, i) => i !== index),
    }))
    if (editingPlanIndex === index) {
      setEditingPlanIndex(null)
      setNewPlan({
        nombre: "",
        gigas: "",
        precio_mensual: "",
        precio_mensual_normal: "",
        meses_promocion: "",
      })
    }
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
      tiene_ram_virtual: formData.tiene_ram_virtual,
      tiene_almacenamiento_expandible: formData.tiene_almacenamiento_expandible,
      colores: formData.colores,
      incluye_plan: formData.incluye_plan,
      nombre_plan: formData.incluye_plan ? formData.nombre_plan : null,
      info_gigas_plan: formData.incluye_plan ? formData.info_gigas_plan : null,
      precio_mensual_plan: formData.incluye_plan ? Number.parseFloat(formData.precio_mensual_plan) : null,
      precio_mensual_plan_normal: formData.incluye_plan ? Number.parseFloat(formData.precio_mensual_plan_normal) : null,
      meses_plan_promocional: formData.incluye_plan ? Number.parseInt(formData.meses_plan_promocional) : null,
      planes: formData.incluye_plan ? formData.planes : [],
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

        // Update box contents
        // Remove existing box contents
        await supabase.from("phone_box_contents").delete().eq("phone_id", phoneId)

        // Add selected box contents
        if (selectedBoxContents.length > 0) {
          const boxContentInserts = selectedBoxContents.map((contentId) => ({
            phone_id: phoneId,
            box_content_id: contentId,
          }))
          await supabase.from("phone_box_contents").insert(boxContentInserts)
        }
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving phone:", err)
      setError(err?.message || "Error al guardar")
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
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="tiene_ram_virtual"
                checked={formData.tiene_ram_virtual}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, tiene_ram_virtual: checked }))}
              />
              <Label htmlFor="tiene_ram_virtual" className="text-sm font-normal cursor-pointer">
                ¿Tiene RAM Virtual?
              </Label>
            </div>
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
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="tiene_almacenamiento_expandible"
                checked={formData.tiene_almacenamiento_expandible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, tiene_almacenamiento_expandible: checked }))
                }
              />
              <Label htmlFor="tiene_almacenamiento_expandible" className="text-sm font-normal cursor-pointer">
                ¿Almacenamiento Expandible?
              </Label>
            </div>
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

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colores Disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {formData.colores?.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
              >
                <div
                  className="w-6 h-6 rounded-full border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium">{color.nombre}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveColor(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-3">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="newColorName">Nombre del Color</Label>
              <Input
                id="newColorName"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Ej: Azul Medianoche"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newColorHex">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="newColorHex"
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-24 font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
            <Button type="button" onClick={handleAddColor} disabled={!newColorName}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financing & Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Financiamiento y Plan</span>
            <div className="flex items-center space-x-2">
              <Switch
                id="incluye_plan"
                checked={formData.incluye_plan}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, incluye_plan: checked }))}
              />
              <Label htmlFor="incluye_plan" className="text-sm font-normal cursor-pointer">
                ¿Disponible con Plan?
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        {formData.incluye_plan && (
          <CardContent className="space-y-6">
            {/* List of added plans */}
            {formData.planes && formData.planes.length > 0 && (
              <div className="space-y-3">
                <Label>Planes Agregados</Label>
                {formData.planes.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="grid gap-1">
                      <p className="font-medium text-sm">{plan.nombre}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{plan.gigas}</span>
                        <span>•</span>
                        <span>${plan.precio_mensual}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleEditPlan(index)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemovePlan(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Plan Form */}
            <div className="grid gap-4 p-4 border rounded-lg bg-muted/10">
              <h4 className="font-medium text-sm flex items-center gap-2">
                {editingPlanIndex !== null ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingPlanIndex !== null ? "Editar Plan" : "Agregar Nuevo Plan"}
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="new_plan_nombre">Nombre del Plan</Label>
                  <Input
                    id="new_plan_nombre"
                    value={newPlan.nombre}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Plan MAX L LIBRE"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new_plan_gigas">Gigas</Label>
                  <Input
                    id="new_plan_gigas"
                    value={newPlan.gigas}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, gigas: e.target.value }))}
                    placeholder="300GB"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new_plan_precio">Precio Mensual (Oferta)</Label>
                  <Input
                    id="new_plan_precio"
                    type="number"
                    value={newPlan.precio_mensual}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, precio_mensual: e.target.value }))}
                    placeholder="7990"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new_plan_precio_normal">Precio Mensual (Normal)</Label>
                  <Input
                    id="new_plan_precio_normal"
                    type="number"
                    value={newPlan.precio_mensual_normal}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, precio_mensual_normal: e.target.value }))}
                    placeholder="14990"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new_plan_meses">Meses Promoción</Label>
                  <Input
                    id="new_plan_meses"
                    type="number"
                    value={newPlan.meses_promocion}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, meses_promocion: e.target.value }))}
                    placeholder="6"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAddPlan}
                disabled={!newPlan.nombre || !newPlan.precio_mensual}
                variant="secondary"
                className="w-full"
              >
                {editingPlanIndex !== null ? "Actualizar Plan" : "Agregar a la lista"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ImageUpload
            label="Imagen Principal"
            value={formData.foto_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, foto_url: url }))}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Imagen Secundaria"
              value={formData.foto_url_2}
              onChange={(url) => setFormData((prev) => ({ ...prev, foto_url_2: url }))}
            />
            <ImageUpload
              label="Imagen Terciaria"
              value={formData.foto_url_3}
              onChange={(url) => setFormData((prev) => ({ ...prev, foto_url_3: url }))}
            />
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

      {/* Box Contents */}
      <Card>
        <CardHeader>
          <CardTitle>Contenido de la Caja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boxContents.map((content) => (
              <div
                key={content.id}
                className="flex items-center space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={content.id}
                  checked={selectedBoxContents.includes(content.id)}
                  onCheckedChange={() => toggleBoxContent(content.id)}
                />
                <Label htmlFor={content.id} className="flex-1 cursor-pointer font-normal flex items-center gap-2">
                  {/* You can render icon here if you want, e.g. using a mapping or dynamic icon */}
                  {content.name}
                </Label>
              </div>
            ))}
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

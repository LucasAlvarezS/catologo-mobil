"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
}

export function PhoneForm({ phone, tags }: PhoneFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const [formData, setFormData] = useState({
    marca: phone?.marca || "",
    modelo: phone?.modelo || "",
    descripcion_corta: phone?.descripcion_corta || "",
    precio_lista: phone?.precio_lista?.toString() || "",
    precio_plan: phone?.precio_plan?.toString() || "",
    precio_descuento: phone?.precio_descuento?.toString() || "",
    porcentaje_descuento: phone?.porcentaje_descuento?.toString() || "",
    precio_portabilidad: phone?.precio_portabilidad?.toString() || "",
    precio_tarjeta_hites: phone?.precio_tarjeta_hites?.toString() || "",
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
    destacado_oferta: phone?.destacado_oferta ?? false,
    stock: phone?.stock?.toString() || "0",
    tiene_ram_virtual: phone?.tiene_ram_virtual ?? false,
    tiene_almacenamiento_expandible: phone?.tiene_almacenamiento_expandible ?? false,
    colores: phone?.colores || [],
    incluye_plan: phone?.incluye_plan ?? false,
    nombre_plan: "",
    info_gigas_plan: "",
    precio_mensual_plan: "",
    precio_mensual_plan_normal: "",
    meses_plan_promocional: "",
    planes: phone?.planes || [],
    especificaciones: phone?.especificaciones || {
      pantalla: { tipo: "", pulgadas: "", resolucion: "", tasa_refresco: "", proteccion: "" },
      bateria: { capacidad: "", carga_rapida: "", carga_inalambrica: "" },
      camara: { trasera_principal: "", trasera_ultra_gran_angular: "", trasera_teleobjetivo: "", frontal_principal: "", video: "" },
      sistema_operativo: "",
      conectividad: { nfc: false, red: "", bluetooth: "", sim: "" },
    },
  })

  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#000000")

  const [selectedTags, setSelectedTags] = useState<string[]>(phone?.tags?.map((t) => t.id) || [])
  const [availablePlanes, setAvailablePlanes] = useState<any[]>([])

  useEffect(() => {
    const fetchPlanes = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("planes").select("*").order("precio_mensual", { ascending: true })
      if (data) setAvailablePlanes(data)
    }
    fetchPlanes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'porcentaje_descuento') {
      const percent = parseFloat(value)
      const listPrice = parseFloat(formData.precio_lista)
      
      if (!isNaN(percent) && !isNaN(listPrice)) {
        const discountPrice = listPrice * (1 - percent / 100)
        setFormData(prev => ({
          ...prev,
          [name]: value,
          precio_descuento: Math.round(discountPrice).toString()
        }))
        return
      }
    }

    if (name === 'precio_lista') {
       const listPrice = parseFloat(value)
       // @ts-ignore - porcentaje_descuento exists in state but TS might not know it yet if inferred from initial state without explicit type
       const percent = parseFloat(formData.porcentaje_descuento)
       
       if (!isNaN(percent) && !isNaN(listPrice)) {
         const discountPrice = listPrice * (1 - percent / 100)
         setFormData(prev => ({
           ...prev,
           [name]: value,
           precio_descuento: Math.round(discountPrice).toString()
         }))
         return
       }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (category: string, field: string, value: any) => {
    setFormData((prev) => {
      // @ts-ignore
      const currentCategory = prev.especificaciones?.[category]
      const isObject = typeof currentCategory === 'object' && currentCategory !== null

      return {
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          [category]: isObject
            ? {
                ...currentCategory,
                [field]: value,
              }
            : { [field]: value },
        },
      }
    })
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
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

  const handleTogglePlan = (plan: any) => {
    setFormData((prev) => {
      const currentPlanes = prev.planes || []
      const exists = currentPlanes.some((p) => p.nombre === plan.nombre)
      
      if (exists) {
        return {
          ...prev,
          planes: currentPlanes.filter((p) => p.nombre !== plan.nombre)
        }
      } else {
        return {
          ...prev,
          planes: [...currentPlanes, {
            nombre: plan.nombre,
            gigas: plan.gigas,
            precio_mensual: plan.precio_mensual,
            precio_mensual_normal: plan.precio_mensual_normal,
            meses_promocion: plan.meses_promocion,
            redes_sociales: plan.redes_sociales,
            linea_adicional: plan.linea_adicional,
            descripcion: plan.descripcion
          }]
        }
      }
    })
  }

  const handleAddExtra = (category: string, label: string, value: string) => {
    if (!label || !value) return
    setFormData((prev) => {
      // @ts-ignore
      const currentCategory = prev.especificaciones?.[category] || {}
      const currentExtras = currentCategory.extras || []
      
      return {
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          [category]: {
            ...currentCategory,
            extras: [...currentExtras, { label, value }]
          }
        }
      }
    })
  }

  const handleRemoveExtra = (category: string, index: number) => {
    setFormData((prev) => {
      // @ts-ignore
      const currentCategory = prev.especificaciones?.[category] || {}
      const currentExtras = currentCategory.extras || []
      
      return {
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          [category]: {
            ...currentCategory,
            extras: currentExtras.filter((_: any, i: number) => i !== index)
          }
        }
      }
    })
  }

  const CustomSpecsManager = ({ category }: { category: string }) => {
    const [label, setLabel] = useState("")
    const [value, setValue] = useState("")
    // @ts-ignore
    const extras = formData.especificaciones?.[category]?.extras || []

    return (
      <div className="col-span-full mt-4 border-t pt-4">
        <h4 className="text-sm font-semibold mb-3">Detalles Adicionales</h4>
        
        {/* List of extras */}
        {extras.length > 0 && (
          <div className="grid gap-2 mb-4">
            {extras.map((extra: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded border">
                <span className="text-sm"><span className="font-medium">{extra.label}:</span> {extra.value}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-red-500"
                  onClick={() => handleRemoveExtra(category, idx)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        <div className="flex gap-2 items-end">
          <div className="grid gap-1 flex-1">
            <Label className="text-xs">Nombre (Ej: Carga Inversa)</Label>
            <Input 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              placeholder="Nombre del detalle"
              className="h-8 text-sm"
            />
          </div>
          <div className="grid gap-1 flex-1">
            <Label className="text-xs">Valor (Ej: 10W)</Label>
            <Input 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              placeholder="Valor"
              className="h-8 text-sm"
            />
          </div>
          <Button 
            type="button" 
            size="sm"
            className="h-8"
            onClick={() => {
              handleAddExtra(category, label, value)
              setLabel("")
              setValue("")
            }}
            disabled={!label || !value}
          >
            <Plus className="w-3 h-3 mr-1" /> Añadir
          </Button>
        </div>
      </div>
    )
  }

  const SpecSwitch = ({ 
    category, 
    field, 
    label, 
    placeholder = "SÍ" 
  }: { 
    category: string, 
    field: string, 
    label: string, 
    placeholder?: string 
  }) => {
    // @ts-ignore
    const currentValue = formData.especificaciones?.[category]?.[field]
    const isChecked = currentValue && currentValue.toUpperCase() !== "NO" && currentValue !== ""

    return (
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Switch
            checked={isChecked}
            onCheckedChange={(checked) => {
              handleSpecChange(category, field, checked ? placeholder : "NO")
            }}
          />
        </div>
        <Input 
          value={currentValue || ""} 
          onChange={(e) => handleSpecChange(category, field, e.target.value)}
          placeholder={placeholder}
          className={!isChecked ? "opacity-50" : ""}
        />
      </div>
    )
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
      // @ts-ignore
      porcentaje_descuento: formData.porcentaje_descuento ? Number.parseInt(formData.porcentaje_descuento) : 0,
      precio_portabilidad: formData.precio_portabilidad ? Number.parseFloat(formData.precio_portabilidad) : null,
      precio_tarjeta_hites: formData.precio_tarjeta_hites ? Number.parseFloat(formData.precio_tarjeta_hites) : null,
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
      destacado_oferta: formData.destacado_oferta,
      stock: Number.parseInt(formData.stock) || 0,
      tiene_ram_virtual: formData.tiene_ram_virtual,
      tiene_almacenamiento_expandible: formData.tiene_almacenamiento_expandible,
      colores: formData.colores,
      incluye_plan: formData.incluye_plan,
      nombre_plan: null,
      info_gigas_plan: null,
      precio_mensual_plan: null,
      precio_mensual_plan_normal: null,
      meses_plan_promocional: null,
      planes: formData.incluye_plan ? formData.planes : [],
      especificaciones: formData.especificaciones,
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
          <CardTitle>Precios y Ofertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Precio Base */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="precio_lista">Precio Lista (Base) *</Label>
              <Input
                id="precio_lista"
                name="precio_lista"
                type="number"
                step="0.01"
                value={formData.precio_lista}
                onChange={handleChange}
                required
                placeholder="999990"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="porcentaje_descuento">% Descuento General</Label>
              <Input
                id="porcentaje_descuento"
                name="porcentaje_descuento"
                type="number"
                min="0"
                max="100"
                // @ts-ignore
                value={formData.porcentaje_descuento}
                onChange={handleChange}
                placeholder="20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio_descuento">Precio Descuento (Calculado)</Label>
              <Input
                id="precio_descuento"
                name="precio_descuento"
                type="number"
                step="0.01"
                value={formData.precio_descuento}
                onChange={handleChange}
                placeholder="Calculado automáticamente"
                readOnly
                className="bg-slate-100"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-4">Precios Especiales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 border p-4 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="precio_portabilidad" className="font-medium">Precio Portabilidad</Label>
                  <Switch 
                    checked={!!formData.precio_portabilidad}
                    onCheckedChange={(checked) => {
                      if (!checked) setFormData(prev => ({ ...prev, precio_portabilidad: "" }))
                      else setFormData(prev => ({ ...prev, precio_portabilidad: "0" }))
                    }}
                  />
                </div>
                {formData.precio_portabilidad !== "" && (
                  <Input
                    id="precio_portabilidad"
                    name="precio_portabilidad"
                    type="number"
                    value={formData.precio_portabilidad}
                    onChange={handleChange}
                    placeholder="Ej: 199990"
                  />
                )}
                <p className="text-xs text-slate-500">
                  Precio exclusivo al portarse de compañía. Se mostrará como primera opción.
                </p>
              </div>

              <div className="space-y-3 border p-4 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="precio_tarjeta_hites" className="font-medium">Precio Tarjeta Hites</Label>
                  <Switch 
                    checked={!!formData.precio_tarjeta_hites}
                    onCheckedChange={(checked) => {
                      if (!checked) setFormData(prev => ({ ...prev, precio_tarjeta_hites: "" }))
                      else setFormData(prev => ({ ...prev, precio_tarjeta_hites: "0" }))
                    }}
                  />
                </div>
                {formData.precio_tarjeta_hites !== "" && (
                  <Input
                    id="precio_tarjeta_hites"
                    name="precio_tarjeta_hites"
                    type="number"
                    value={formData.precio_tarjeta_hites}
                    onChange={handleChange}
                    placeholder="Ej: 189990"
                  />
                )}
                <p className="text-xs text-slate-500">
                  Precio exclusivo pagando con Tarjeta Hites. Se mostrará como segunda opción.
                </p>
              </div>
            </div>
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

      {/* Advanced Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles Técnicos (Avanzado)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Software */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Software</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tipo de Celular</Label>
                <Input 
                  value={formData.especificaciones?.software?.tipo_celular || ""} 
                  onChange={(e) => handleSpecChange("software", "tipo_celular", e.target.value)}
                  placeholder="Smartphone" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Condición</Label>
                <Input 
                  value={formData.especificaciones?.software?.condicion || ""} 
                  onChange={(e) => handleSpecChange("software", "condicion", e.target.value)}
                  placeholder="Nuevo / Reacondicionado" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Sistema Operativo (OS)</Label>
                <Input 
                  value={formData.especificaciones?.software?.os || ""} 
                  onChange={(e) => handleSpecChange("software", "os", e.target.value)}
                  placeholder="iOS / Android" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Versión</Label>
                <Input 
                  value={formData.especificaciones?.software?.version || ""} 
                  onChange={(e) => handleSpecChange("software", "version", e.target.value)}
                  placeholder="17 / 14" 
                />
              </div>
            </div>
            <CustomSpecsManager category="software" />
          </div>

          <div className="border-t" />

          {/* Pantalla */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Pantalla</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="grid gap-2">
                <Label>Tipo de Pantalla</Label>
                <Input 
                  value={formData.especificaciones?.pantalla?.tipo || ""} 
                  onChange={(e) => handleSpecChange("pantalla", "tipo", e.target.value)}
                  placeholder="OLED / IPS / VA" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Tamaño</Label>
                <Input 
                  value={formData.especificaciones?.pantalla?.tamano || ""} 
                  onChange={(e) => handleSpecChange("pantalla", "tamano", e.target.value)}
                  placeholder='6.1"' 
                />
              </div>
              <div className="grid gap-2">
                <Label>Resolución</Label>
                <Input 
                  value={formData.especificaciones?.pantalla?.resolucion || ""} 
                  onChange={(e) => handleSpecChange("pantalla", "resolucion", e.target.value)}
                  placeholder="2556 x 1179" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Densidad</Label>
                <Input 
                  value={formData.especificaciones?.pantalla?.densidad || ""} 
                  onChange={(e) => handleSpecChange("pantalla", "densidad", e.target.value)}
                  placeholder="460 ppi" 
                />
              </div>
            </div>
            <CustomSpecsManager category="pantalla" />
          </div>

          <div className="border-t" />

          {/* Cámara */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Cámara</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Cantidad Traseras</Label>
                <Input 
                  value={formData.especificaciones?.camara?.trasera_cantidad || ""} 
                  onChange={(e) => handleSpecChange("camara", "trasera_cantidad", e.target.value)}
                  placeholder="2" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Principal (MP)</Label>
                <Input 
                  value={formData.especificaciones?.camara?.trasera_descripcion || ""} 
                  onChange={(e) => handleSpecChange("camara", "trasera_descripcion", e.target.value)}
                  placeholder="48 + 12 MP" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Frontal / Secundaria (MP)</Label>
                <Input 
                  value={formData.especificaciones?.camara?.frontal_descripcion || ""} 
                  onChange={(e) => handleSpecChange("camara", "frontal_descripcion", e.target.value)}
                  placeholder="12 MP" 
                />
              </div>
            </div>
            <CustomSpecsManager category="camara" />
          </div>

          <div className="border-t" />

          {/* Batería */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Batería</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Input 
                  value={formData.especificaciones?.bateria?.tipo || ""} 
                  onChange={(e) => handleSpecChange("bateria", "tipo", e.target.value)}
                  placeholder="Li-ion" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Capacidad Exacta</Label>
                <Input 
                  value={formData.especificaciones?.bateria?.capacidad || ""} 
                  onChange={(e) => handleSpecChange("bateria", "capacidad", e.target.value)}
                  placeholder="3349 mAh" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Carga Rápida</Label>
                <Input 
                  value={formData.especificaciones?.bateria?.carga_rapida || ""} 
                  onChange={(e) => handleSpecChange("bateria", "carga_rapida", e.target.value)}
                  placeholder="Sí" 
                />
              </div>
            </div>
            <CustomSpecsManager category="bateria" />
          </div>

          <div className="border-t" />

          {/* Memoria */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Memoria y SIM</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Tipo SIM</Label>
                <Input 
                  value={formData.especificaciones?.memoria?.sim_tipo || ""} 
                  onChange={(e) => handleSpecChange("memoria", "sim_tipo", e.target.value)}
                  placeholder="Nano SIM" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Dual SIM</Label>
                <Input 
                  value={formData.especificaciones?.memoria?.dual_sim || ""} 
                  onChange={(e) => handleSpecChange("memoria", "dual_sim", e.target.value)}
                  placeholder="Sí, (1 Nano + 1 eSIM)" 
                />
              </div>
              <SpecSwitch category="memoria" field="esim" label="eSIM" />
              <div className="grid gap-2">
                <Label>RAM</Label>
                <Input 
                  value={formData.especificaciones?.memoria?.ram || ""} 
                  onChange={(e) => handleSpecChange("memoria", "ram", e.target.value)}
                  placeholder="6 GB" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Interna</Label>
                <Input 
                  value={formData.especificaciones?.memoria?.almacenamiento || ""} 
                  onChange={(e) => handleSpecChange("memoria", "almacenamiento", e.target.value)}
                  placeholder="128 GB" 
                />
              </div>
            </div>
            <CustomSpecsManager category="memoria" />
          </div>

          <div className="border-t" />

          {/* Procesador */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Procesador</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Chipset</Label>
                <Input 
                  value={formData.especificaciones?.procesador?.chipset || ""} 
                  onChange={(e) => handleSpecChange("procesador", "chipset", e.target.value)}
                  placeholder="A16 Bionic" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Núcleos</Label>
                <Input 
                  value={formData.especificaciones?.procesador?.nucleos || ""} 
                  onChange={(e) => handleSpecChange("procesador", "nucleos", e.target.value)}
                  placeholder="Hexa-Core" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Velocidad</Label>
                <Input 
                  value={formData.especificaciones?.procesador?.velocidad || ""} 
                  onChange={(e) => handleSpecChange("procesador", "velocidad", e.target.value)}
                  placeholder="2 x 3.46 GHz..." 
                />
              </div>
            </div>
            <CustomSpecsManager category="procesador" />
          </div>

          <div className="border-t" />

          {/* Dimensiones */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dimensiones</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Medidas</Label>
                <Input 
                  value={formData.especificaciones?.dimensiones?.medidas || ""} 
                  onChange={(e) => handleSpecChange("dimensiones", "medidas", e.target.value)}
                  placeholder="147.6 x 71.6 x 7.8 mm" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Peso</Label>
                <Input 
                  value={formData.especificaciones?.dimensiones?.peso || ""} 
                  onChange={(e) => handleSpecChange("dimensiones", "peso", e.target.value)}
                  placeholder="171 g" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Índice SAR</Label>
                <Input 
                  value={formData.especificaciones?.dimensiones?.indice_sar || ""} 
                  onChange={(e) => handleSpecChange("dimensiones", "indice_sar", e.target.value)}
                  placeholder="1,14 W/Kg" 
                />
              </div>
            </div>
            <CustomSpecsManager category="dimensiones" />
          </div>

          <div className="border-t" />

          {/* Contenido Caja */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contenido Caja</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="grid gap-2">
                <Label>Tipo de cable</Label> 
                <Input
                  value={formData.especificaciones?.contenido_caja?.cable || ""} 
                  onChange={(e) => handleSpecChange("contenido_caja", "cable", e.target.value)}
                  placeholder="SÍ" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Cargador</Label>
                <Input 
                  value={formData.especificaciones?.contenido_caja?.cargador || ""} 
                  onChange={(e) => handleSpecChange("contenido_caja", "cargador", e.target.value)}
                  placeholder="NO" 
                />
              </div>
              <SpecSwitch category="contenido_caja" field="manual" label="Manual" />
              <div className="grid gap-2">
                <Label>Audífonos</Label>
                <Input 
                  value={formData.especificaciones?.contenido_caja?.audifonos || ""} 
                  onChange={(e) => handleSpecChange("contenido_caja", "audifonos", e.target.value)}
                  placeholder="NO" 
                />
              </div>
              <SpecSwitch category="contenido_caja" field="tarjeta_memoria" label="Tarjeta de Memoria" placeholder="NO" />
            </div>
            <CustomSpecsManager category="contenido_caja" />
          </div>

          <div className="border-t" />

          {/* Sensores */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Sensores</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <SpecSwitch category="sensores" field="huella" label="Huella" placeholder="SÍ" />
              <SpecSwitch category="sensores" field="facial" label="Facial" placeholder="SÍ" />
              <SpecSwitch category="sensores" field="luz" label="Luz" placeholder="SÍ" />
              <SpecSwitch category="sensores" field="giroscopio" label="Giroscopio" placeholder="SÍ" />
            </div>
            <CustomSpecsManager category="sensores" />
          </div>

          <div className="border-t" />

          {/* Protecciones */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Protecciones</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <SpecSwitch category="protecciones" field="agua" label="Agua" placeholder="SÍ" />
              <SpecSwitch category="protecciones" field="polvo" label="Polvo" placeholder="SÍ" />
              <div className="grid gap-2">
                <Label>Certificación</Label>
                <Input 
                  value={formData.especificaciones?.protecciones?.ip_rating || ""} 
                  onChange={(e) => handleSpecChange("protecciones", "ip_rating", e.target.value)}
                  placeholder="IP68" 
                />
              </div>
            </div>
            <CustomSpecsManager category="protecciones" />
          </div>

          <div className="border-t" />

          {/* Conectividad */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Conectividad</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <SpecSwitch category="conectividad" field="nfc" label="NFC" placeholder="SÍ" />
              <div className="grid gap-2">
                <Label>Red</Label>
                <Input 
                  value={formData.especificaciones?.conectividad?.red || ""} 
                  onChange={(e) => handleSpecChange("conectividad", "red", e.target.value)}
                  placeholder="5G" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Bluetooth</Label>
                <Input 
                  value={formData.especificaciones?.conectividad?.bluetooth || ""} 
                  onChange={(e) => handleSpecChange("conectividad", "bluetooth", e.target.value)}
                  placeholder="5.3" 
                />
              </div>
              <div className="grid gap-2">
                <Label>USB</Label>
                <Input 
                  value={formData.especificaciones?.conectividad?.usb || ""} 
                  onChange={(e) => handleSpecChange("conectividad", "usb", e.target.value)}
                  placeholder="USB-C 2.0" 
                />
              </div>
            </div>
            <CustomSpecsManager category="conectividad" />
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Seleccionar Planes Disponibles</Label>
                <Link href="/admin/planes" target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Gestionar Planes <Plus className="w-3 h-3" />
                </Link>
              </div>
              
              {availablePlanes.length === 0 ? (
                <div className="text-center p-4 border rounded-lg bg-muted/20 text-muted-foreground text-sm">
                  No hay planes registrados en el sistema.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availablePlanes.map((plan) => {
                    const isSelected = formData.planes?.some(p => p.nombre === plan.nombre)
                    return (
                      <div 
                        key={plan.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50'}`}
                      >
                        <div className="grid gap-1">
                          <p className="font-medium text-sm">{plan.nombre}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>{plan.gigas}</span>
                            <span>•</span>
                            <span>${plan.precio_mensual}</span>
                          </div>
                        </div>
                        <Switch
                          checked={isSelected}
                          onCheckedChange={() => handleTogglePlan(plan)}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Slider */}
          <div className="space-y-4">
            {/* Main Image Preview */}
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-sm">
              <Image
                src={
                  [formData.foto_url, formData.foto_url_2, formData.foto_url_3][activeImageIndex] ||
                  "/placeholder.svg?height=600&width=600&query=smartphone"
                }
                alt={`Vista previa ${activeImageIndex + 1}`}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-3">
              {[formData.foto_url, formData.foto_url_2, formData.foto_url_3].map((url, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    activeImageIndex === i
                      ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  {url ? (
                    <Image src={url || "/placeholder.svg"} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-2" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs text-center p-1">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-slate-900/50 text-white text-[10px] px-1 rounded-tl">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Image Uploader */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">
                {activeImageIndex === 0
                  ? "Imagen Principal"
                  : activeImageIndex === 1
                    ? "Imagen Secundaria"
                    : "Imagen Terciaria"}
              </Label>
              <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded border">
                Editando imagen {activeImageIndex + 1} de 3
              </span>
            </div>

            <ImageUpload
              label={`Subir ${
                activeImageIndex === 0
                  ? "Imagen Principal"
                  : activeImageIndex === 1
                    ? "Imagen Secundaria"
                    : "Imagen Terciaria"
              }`}
              value={[formData.foto_url, formData.foto_url_2, formData.foto_url_3][activeImageIndex] || ""}
              onChange={(url) => {
                const keys = ["foto_url", "foto_url_2", "foto_url_3"] as const
                // @ts-ignore
                const key = keys[activeImageIndex]
                setFormData((prev) => ({ ...prev, [key]: url }))
              }}
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



      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Estado</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="activo" className="text-base font-semibold">
                Visible en Catálogo
              </Label>
              <p className="text-sm text-muted-foreground">
                 {formData.activo ? "El teléfono es visible para todos" : "El teléfono está oculto"}
              </p>
            </div>
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, activo: checked }))}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="destacado_oferta" className="text-base font-semibold">
                Destacar Oferta
              </Label>
              <p className="text-sm text-muted-foreground">
                Muestra en carrusel principal
              </p>
            </div>
            <Switch
              id="destacado_oferta"
              checked={formData.destacado_oferta}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, destacado_oferta: checked }))}
            />
          </div>
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

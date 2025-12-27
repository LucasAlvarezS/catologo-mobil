"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Pencil, Trash2, Plus, ArrowLeft, Check, X, Facebook, Instagram, Twitter, MessageCircle, Send, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"

interface Plan {
  id: string
  nombre: string
  gigas: string
  minutos: string
  precio_mensual: number
  precio_mensual_normal: number
  redes_sociales: string[]
  portabilidad_exclusiva: boolean
  meses_promocion: number
  linea_adicional: boolean
}

const SOCIAL_NETWORKS = [
  { id: "Facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "Instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { id: "X", label: "X (Twitter)", icon: Twitter, color: "text-sky-500" },
  { id: "WhatsApp", label: "WhatsApp", icon: Phone, color: "text-green-500" },
  { id: "Messenger", label: "Messenger", icon: MessageCircle, color: "text-blue-500" },
  { id: "Telegram", label: "Telegram", icon: Send, color: "text-sky-400" },
]

export default function PlanesManagerPage() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Plan>>({
    nombre: "",
    gigas: "",
    minutos: "300 minutos",
    precio_mensual: 0,
    precio_mensual_normal: 0,
    redes_sociales: ["Facebook", "Instagram", "WhatsApp"],
    portabilidad_exclusiva: false,
    meses_promocion: 0,
    linea_adicional: false
  })

  useEffect(() => {
    fetchPlanes()
  }, [])

  const fetchPlanes = async () => {
    const { data, error } = await supabase
      .from("planes")
      .select("*")
      .order("precio_mensual", { ascending: true })

    if (data) setPlanes(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingPlan) {
        // Actualizar
        const { error } = await supabase
          .from("planes")
          .update(formData)
          .eq("id", editingPlan.id)
        
        if (error) throw error
      } else {
        // Crear
        const { error } = await supabase
          .from("planes")
          .insert([formData])
        
        if (error) throw error
      }

      await fetchPlanes()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving plan:", error)
      alert("Error al guardar el plan")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este plan?")) return

    const { error } = await supabase.from("planes").delete().eq("id", id)
    if (!error) fetchPlanes()
  }

  const handleToggleSocial = async (plan: Plan, checked: boolean) => {
    // Optimistic update
    setPlanes(planes.map(p => p.id === plan.id ? { ...p, redes_sociales: checked } : p))

    const { error } = await supabase
      .from("planes")
      .update({ redes_sociales: checked })
      .eq("id", plan.id)
    
    if (error) {
      console.error("Error updating social networks:", error)
      // Revert on error
      fetchPlanes()
    }
  }

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData(plan)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingPlan(null)
    setFormData({
      nombre: "",
      gigas: "",
      minutos: "300 minutos",
      precio_mensual: 0,
      precio_mensual_normal: 0,
      redes_sociales: ["Facebook", "Instagram", "WhatsApp"],
      portabilidad_exclusiva: false,
      meses_promocion: 0,
      linea_adicional: false
    })
  }

  const toggleSocialNetwork = (networkId: string) => {
    const current = formData.redes_sociales || []
    const updated = current.includes(networkId)
      ? current.filter(id => id !== networkId)
      : [...current, networkId]
    setFormData({ ...formData, redes_sociales: updated })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gestión de Planes</h1>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre (ej: Plan M)</Label>
                  <Input 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Plan S"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gigas (ej: 100 GB)</Label>
                  <Input 
                    value={formData.gigas} 
                    onChange={(e) => setFormData({...formData, gigas: e.target.value})}
                    placeholder="100 GB"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio Oferta</Label>
                  <Input 
                    type="number"
                    value={formData.precio_mensual} 
                    onChange={(e) => setFormData({...formData, precio_mensual: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Normal</Label>
                  <Input 
                    type="number"
                    value={formData.precio_mensual_normal} 
                    onChange={(e) => setFormData({...formData, precio_mensual_normal: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minutos</Label>
                  <Input 
                    value={formData.minutos} 
                    onChange={(e) => setFormData({...formData, minutos: e.target.value})}
                    placeholder="300 minutos"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meses Promo</Label>
                  <Input 
                    type="number"
                    value={formData.meses_promocion} 
                    onChange={(e) => setFormData({...formData, meses_promocion: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox 
                  id="linea_adicional"
                  checked={formData.linea_adicional}
                  onCheckedChange={(checked) => setFormData({...formData, linea_adicional: checked as boolean})}
                />
                <Label htmlFor="linea_adicional" className="cursor-pointer">
                  ¿Incluye línea adicional?
                </Label>
              </div>

              <div className="space-y-3 border rounded-lg p-3">
                <Label>Redes Sociales Incluidas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_NETWORKS.map((network) => (
                    <div key={network.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`social-${network.id}`}
                        checked={formData.redes_sociales?.includes(network.id)}
                        onCheckedChange={() => toggleSocialNetwork(network.id)}
                      />
                      <Label 
                        htmlFor={`social-${network.id}`} 
                        className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                      >
                        <network.icon className={`h-4 w-4 ${network.color}`} />
                        {network.label}
                      </Label>
                    </div>
                  ))}
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
              <TableHead>Nombre</TableHead>
              <TableHead>Gigas</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>RRSS</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planes.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.nombre}</TableCell>
                <TableCell>{plan.gigas}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-green-600">{formatPrice(plan.precio_mensual)}</span>
                    <span className="text-xs text-slate-400 line-through">{formatPrice(plan.precio_mensual_normal)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {plan.redes_sociales && plan.redes_sociales.length > 0 ? (
                      plan.redes_sociales.map((networkId) => {
                        const network = SOCIAL_NETWORKS.find(n => n.id === networkId)
                        if (!network) return null
                        return (
                          <network.icon key={networkId} className={`h-4 w-4 ${network.color}`} title={network.label} />
                        )
                      })
                    ) : (
                      <span className="text-xs text-slate-400">Ninguna</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {planes.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No hay planes creados. ¡Crea el primero!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

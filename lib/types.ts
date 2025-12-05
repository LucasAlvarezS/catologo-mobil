export interface Tag {
  id: string
  nombre: string
  descripcion: string | null
  color: string | null
}

export interface BoxContent {
  id: string
  name: string
  icon: string | null
}

export interface Telefono {
  id: string
  marca: string
  modelo: string
  descripcion_corta: string | null
  precio_lista: number
  precio_plan: number | null
  precio_descuento: number | null
  ram: string | null
  almacenamiento: string | null
  procesador: string | null
  bateria: string | null
  camara: string | null
  pantalla: string | null
  foto_url: string | null
  foto_url_2: string | null
  foto_url_3: string | null
  activo: boolean
  stock: number
  tiene_ram_virtual?: boolean
  tiene_almacenamiento_expandible?: boolean
  colores?: { nombre: string; hex: string }[] | null
  incluye_plan?: boolean
  pie_inicial?: number
  cantidad_cuotas?: number
  nombre_plan?: string
  info_gigas_plan?: string
  precio_mensual_plan?: number
  precio_mensual_plan_normal?: number
  meses_plan_promocional?: number
  planes?: {
    nombre: string
    gigas: string
    precio_mensual: number
    precio_mensual_normal: number
    meses_promocion: number
  }[] | null
  created_at: string
  updated_at: string
}

export interface TelefonoWithTags extends Telefono {
  tags: Tag[]
  box_contents?: BoxContent[]
}

export interface TelefonoTag {
  id: string
  telefono_id: string
  tag_id: string
}

export const TAG_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  uso_basico: { label: "Básico", color: "bg-slate-100 text-slate-700", icon: "📱" },
  redes_sociales: { label: "Redes Sociales", color: "bg-pink-100 text-pink-700", icon: "📸" },
  banco: { label: "Banco", color: "bg-green-100 text-green-700", icon: "🏦" },
  gaming_ligero: { label: "Gaming Ligero", color: "bg-blue-100 text-blue-700", icon: "🎮" },
  gaming_pesado: { label: "Gaming Pro", color: "bg-orange-100 text-orange-700", icon: "🔥" },
}

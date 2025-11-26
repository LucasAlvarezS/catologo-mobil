export interface Tag {
  id: string
  nombre: string
  descripcion: string | null
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
  created_at: string
  updated_at: string
}

export interface TelefonoWithTags extends Telefono {
  tags: Tag[]
}

export interface TelefonoTag {
  id: string
  telefono_id: string
  tag_id: string
}

export interface CarritoItem {
  id: string
  user_id: string
  telefono_id: string
  cantidad: number
  precio_unitario: number
  created_at: string
  updated_at: string
}

export interface CarritoItemWithPhone extends CarritoItem {
  telefono: Telefono
}

export interface Orden {
  id: string
  user_id: string
  numero_orden: string
  estado: "pendiente" | "pagada" | "procesando" | "enviada" | "entregada" | "cancelada"
  total: number
  impuesto: number | null
  envio: number | null
  notas: string | null
  cliente_nombre: string | null
  cliente_email: string | null
  cliente_telefono: string | null
  cliente_ciudad: string | null
  cliente_direccion: string | null
  metodo_pago: "mercado_pago" | "transferencia" | "efectivo" | null
  referencia_pago: string | null
  created_at: string
  updated_at: string
}

export interface OrdenItem {
  id: string
  orden_id: string
  telefono_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  created_at: string
}

export interface OrdenWithItems extends Orden {
  items: (OrdenItem & { telefono: Telefono })[]
}

export const TAG_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  uso_basico: { label: "Básico", color: "bg-slate-100 text-slate-700", icon: "📱" },
  redes_sociales: { label: "Redes Sociales", color: "bg-pink-100 text-pink-700", icon: "📸" },
  banco: { label: "Banco", color: "bg-green-100 text-green-700", icon: "🏦" },
  gaming_ligero: { label: "Gaming Ligero", color: "bg-blue-100 text-blue-700", icon: "🎮" },
  gaming_pesado: { label: "Gaming Pro", color: "bg-orange-100 text-orange-700", icon: "🔥" },
}

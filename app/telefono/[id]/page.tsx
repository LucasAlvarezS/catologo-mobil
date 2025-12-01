import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { type TelefonoWithTags } from "@/lib/types"
import { PhoneDetailClient } from "@/components/phone-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPhone(id: string): Promise<TelefonoWithTags | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("telefonos")
    .select(`
      *,
      telefono_tags (
        tag_id,
        tags (
          id,
          nombre,
          descripcion
        )
      )
    `)
    .eq("id", id)
    .eq("activo", true)
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    tags: data.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }
}

async function getAllPhones(): Promise<TelefonoWithTags[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("telefonos")
    .select(`
      *,
      telefono_tags (
        tag_id,
        tags (
          id,
          nombre,
          descripcion
        )
      )
    `)
    .eq("activo", true)
    .order("created_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map((phone: any) => ({
    ...phone,
    tags: phone.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const phone = await getPhone(id)

  if (!phone) {
    return { title: "Teléfono no encontrado" }
  }

  return {
    title: `${phone.marca} ${phone.modelo} - TelefonoShop`,
    description:
      phone.descripcion_corta ||
      `Conoce el ${phone.marca} ${phone.modelo}. ${phone.ram} RAM, ${phone.almacenamiento} almacenamiento.`,
    openGraph: {
      title: `${phone.marca} ${phone.modelo}`,
      description: phone.descripcion_corta || `${phone.ram} RAM, ${phone.almacenamiento}`,
      images: phone.foto_url ? [phone.foto_url] : [],
    },
  }
}

export default async function PhoneDetailPage({ params }: Readonly<PageProps>) {
  const { id } = await params
  const [phone, allPhones] = await Promise.all([
    getPhone(id),
    getAllPhones()
  ])

  if (!phone) {
    notFound()
  }

  return <PhoneDetailClient phone={phone} allPhones={allPhones} />
}

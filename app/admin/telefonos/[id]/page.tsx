import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PhoneForm } from "@/components/admin/phone-form"
import type { TelefonoWithTags, Tag } from "@/lib/types"

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
    .single()

  if (error || !data) return null

  return {
    ...data,
    tags: data.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }
}

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("tags").select("*")
  return data || []
}

export default async function EditPhonePage({ params }: PageProps) {
  const { id } = await params
  const [phone, tags] = await Promise.all([getPhone(id), getTags()])

  if (!phone) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Teléfono</h1>
        <p className="text-muted-foreground">
          {phone.marca} {phone.modelo}
        </p>
      </div>
      <PhoneForm phone={phone} tags={tags} />
    </div>
  )
}

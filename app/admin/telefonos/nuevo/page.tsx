import { createClient } from "@/lib/supabase/server"
import { PhoneForm } from "@/components/admin/phone-form"
import type { Tag } from "@/lib/types"

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("tags").select("*")
  return data || []
}

export default async function NewPhonePage() {
  const tags = await getTags()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nuevo Teléfono</h1>
        <p className="text-muted-foreground">Agrega un nuevo teléfono al catálogo</p>
      </div>
      <PhoneForm tags={tags} />
    </div>
  )
}

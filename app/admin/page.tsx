import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneTable } from "@/components/admin/phone-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Smartphone, Tag, Eye } from "lucide-react"
import type { Telefono } from "@/lib/types"

async function getStats() {
  const supabase = await createClient()

  const { count: totalPhones } = await supabase.from("telefonos").select("*", { count: "exact", head: true })

  const { count: activePhones } = await supabase
    .from("telefonos")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  const { count: totalTags } = await supabase.from("tags").select("*", { count: "exact", head: true })

  return {
    totalPhones: totalPhones || 0,
    activePhones: activePhones || 0,
    totalTags: totalTags || 0,
  }
}

async function getPhones(): Promise<Telefono[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("telefonos").select("*").order("created_at", { ascending: false })
  return data || []
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { TagDialog } from "@/components/admin/tag-dialog"

export default async function AdminDashboard() {
  const [stats, phones] = await Promise.all([getStats(), getPhones()])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Administra tu catálogo de teléfonos</p>
        </div>
        <div className="flex gap-2">
          <TagDialog />
          <Button asChild>
            <Link href="/admin/telefonos/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Teléfono
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teléfonos</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPhones}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visibles</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePhones}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTags}</div>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Phone Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teléfonos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhoneTable phones={phones} />
        </CardContent>
      </Card>
    </div>
  )
}

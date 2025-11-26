import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, TrendingUp, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

async function getOrderStats() {
  const supabase = await createClient()

  // Get all orders
  const { data: ordenes, error: ordenesError } = await supabase.from("ordenes").select("*")

  if (ordenesError) throw ordenesError

  // Calculate stats
  const totalOrders = ordenes?.length || 0
  const totalRevenue = ordenes?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0
  const paidOrders = ordenes?.filter((order: any) => order.estado === "pagada").length || 0
  const pendingOrders = ordenes?.filter((order: any) => order.estado === "pendiente").length || 0

  return {
    totalOrders,
    totalRevenue,
    paidOrders,
    pendingOrders,
  }
}

async function getTopPhones() {
  const supabase = await createClient()

  const { data: topPhones, error } = await supabase
    .from("orden_items")
    .select("telefono_id, cantidad, telefono:telefono_id(*)")
    .then(({ data, error }) => {
      if (error) throw error
      // Group by telefono_id and sum quantities
      const grouped = data?.reduce(
        (acc: any, item: any) => {
          const existing = acc.find((x: any) => x.telefono_id === item.telefono_id)
          if (existing) {
            existing.cantidad += item.cantidad
          } else {
            acc.push(item)
          }
          return acc
        },
        [],
      )
      return { data: grouped, error }
    })

  if (error) throw error

  return (topPhones || []).slice(0, 5)
}

async function getRecentOrders() {
  const supabase = await createClient()

  const { data: ordenes, error } = await supabase
    .from("ordenes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return ordenes || []
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
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

export default async function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">Análisis de ventas y rendimiento</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Phones */}
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          }
        >
          <TopPhonesCard />
        </Suspense>

        {/* Recent Orders */}
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          }
        >
          <RecentOrdersCard />
        </Suspense>
      </div>
    </div>
  )
}

async function StatsCards() {
  const stats = await getOrderStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Órdenes Pagadas</CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.paidOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Package className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
        </CardContent>
      </Card>
    </div>
  )
}

async function TopPhonesCard() {
  const topPhones = await getTopPhones()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teléfonos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPhones.map((item: any) => (
            <div key={item.telefono_id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {item.telefono?.marca} {item.telefono?.modelo}
                </p>
                <p className="text-sm text-muted-foreground">{item.cantidad} unidades</p>
              </div>
              <p className="font-bold">{formatPrice(item.telefono?.precio_lista || 0)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

async function RecentOrdersCard() {
  const ordenes = await getRecentOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ordenes.map((orden: any) => (
            <div key={orden.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{orden.numero_orden}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(orden.created_at).toLocaleDateString("es-MX")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(orden.total)}</p>
                <p className={`text-xs font-medium ${
                  orden.estado === "pagada" ? "text-green-600" :
                  orden.estado === "pendiente" ? "text-yellow-600" : "text-gray-600"
                }`}>
                  {orden.estado}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { PhoneFilters } from "@/components/phone-filters"
import { PhoneGrid } from "@/components/phone-grid"
import type { TelefonoWithTags, Tag } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchParams {
  q?: string
  marca?: string
  tags?: string
  min_price?: string
  max_price?: string
}

async function getPhones(searchParams: SearchParams): Promise<TelefonoWithTags[]> {
  const supabase = await createClient()

  let query = supabase
    .from("telefonos")
    .select(`
      *,
      telefono_tags (
        tag_id,
        tags (
          id,
          nombre,
          descripcion,
          color
        )
      )
    `)
    .eq("activo", true)
    .order("created_at", { ascending: false })

  // Search by model or brand
  if (searchParams.q) {
    query = query.or(`modelo.ilike.%${searchParams.q}%,marca.ilike.%${searchParams.q}%`)
  }

  // Filter by brand
  if (searchParams.marca) {
    const brands = searchParams.marca.split(",")
    query = query.in("marca", brands)
  }

  // Filter by price range
  if (searchParams.min_price) {
    query = query.gte("precio_lista", Number(searchParams.min_price))
  }
  if (searchParams.max_price) {
    query = query.lte("precio_lista", Number(searchParams.max_price))
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching phones:", error)
    return []
  }

  // Transform data to include tags array
  let phones: TelefonoWithTags[] = (data || []).map((phone: any) => ({
    ...phone,
    tags: phone.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
  }))

  // Filter by tags (client-side since it's a many-to-many relationship)
  if (searchParams.tags) {
    const tagFilter = searchParams.tags.split(",")
    phones = phones.filter((phone) => phone.tags.some((tag) => tagFilter.includes(tag.nombre)))
  }

  return phones
}

async function getBrands(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("telefonos").select("marca").eq("activo", true)

  const brands = [...new Set((data || []).map((p) => p.marca))]
  return brands.sort()
}

async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("tags").select("*")
  return data || []
}

async function getMaxPrice(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("telefonos")
    .select("precio_lista")
    .eq("activo", true)
    .order("precio_lista", { ascending: false })
    .limit(1)
    .single()

  return data?.precio_lista || 2000
}

function PhoneGridSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-full max-w-[280px] space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>
      ))}
    </div>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [phones, brands, tags, maxPrice] = await Promise.all([getPhones(params), getBrands(), getTags(), getMaxPrice()])

  const hasFilters = params.q || params.marca || params.tags || params.min_price || params.max_price

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full max-w-[1800px] mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 py-16 md:py-24 text-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl mx-auto max-w-7xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Encuentra tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Smartphone Ideal</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
              Compara precios, características y descubre la mejor opción para ti con nuestra Inteligencia Artificial.
            </p>
            
            <div className="max-w-xl mx-auto mt-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-2 rounded-2xl shadow-xl">
                <Suspense fallback={<Skeleton className="h-12 w-full rounded-xl" />}>
                  <SearchBar />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Categories (only show when no filters active) */}
        
        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-10">
          {/* Filters */}
          <aside className="mb-6 lg:mb-0">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <PhoneFilters brands={brands} tags={tags} maxPrice={maxPrice} />
            </Suspense>
          </aside>

          {/* Phone Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{hasFilters ? "Resultados" : "Todos los teléfonos"}</h2>
              <span className="text-sm text-muted-foreground">
                {phones.length} {phones.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            <Suspense fallback={<PhoneGridSkeleton />}>
              <PhoneGrid phones={phones} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}

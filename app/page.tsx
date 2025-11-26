import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { PhoneFilters } from "@/components/phone-filters"
import { PhoneGrid } from "@/components/phone-grid"
import { CategorySection } from "@/components/category-section"
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
          descripcion
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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24" />
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="container px-4 py-6">
        {/* Hero Section */}
        <div className="mb-12 pt-4">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Los Mejores Teléfonos</h1>
              <p className="text-lg text-blue-100 mb-4">Descubre nuestro catálogo de smartphones de última tecnología</p>
              <p className="text-sm text-blue-200 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Precios competitivos • Productos en stock • Consulta sin compromiso por WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Categories (only show when no filters active) */}
        {!hasFilters && (
          <div className="mb-12">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <CategorySection />
            </Suspense>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="mb-8 lg:mb-0">
            <div className="sticky top-24">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <PhoneFilters brands={brands} tags={tags} maxPrice={maxPrice} />
              </Suspense>
            </div>
          </aside>

          {/* Phone Grid */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {hasFilters ? "Resultados de búsqueda" : "Catálogo Completo"}
              </h2>
              <span className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-full font-medium">
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

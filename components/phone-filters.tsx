"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, X } from "lucide-react"
import { type Tag, TAG_LABELS } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface PhoneFiltersProps {
  brands: string[]
  tags: Tag[]
  maxPrice: number
}

export function PhoneFilters({ brands, tags, maxPrice }: PhoneFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("marca")?.split(",").filter(Boolean) || [],
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get("tags")?.split(",").filter(Boolean) || [])
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || maxPrice,
  ])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedBrands.length > 0) {
      params.set("marca", selectedBrands.join(","))
    } else {
      params.delete("marca")
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","))
    } else {
      params.delete("tags")
    }

    if (priceRange[0] > 0) {
      params.set("min_price", priceRange[0].toString())
    } else {
      params.delete("min_price")
    }

    if (priceRange[1] < maxPrice) {
      params.set("max_price", priceRange[1].toString())
    } else {
      params.delete("max_price")
    }

    router.push(`/?${params.toString()}`)
    setOpen(false)
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedTags([])
    setPriceRange([0, maxPrice])
    router.push("/")
    setOpen(false)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const hasActiveFilters =
    selectedBrands.length > 0 || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Marca</Label>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Badge
              key={brand}
              variant={selectedBrands.includes(brand) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Tipo de Uso</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const tagInfo = TAG_LABELS[tag.nombre]
            return tagInfo ? (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.nombre) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleTag(tag.nombre)}
              >
                {tagInfo.label}
              </Badge>
            ) : null
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Rango de Precio</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={50}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={clearFilters} className="flex-1 bg-transparent">
          Limpiar
        </Button>
        <Button onClick={applyFilters} className="flex-1">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {selectedBrands.length +
                    selectedTags.length +
                    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="sticky top-4 p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filtros</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  )
}

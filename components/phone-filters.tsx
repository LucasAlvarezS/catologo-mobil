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
    <div className="space-y-8">
      {/* Brands */}
      <div>
        <Label className="text-lg font-bold text-red-950 mb-4 block">Marca</Label>
        <div className="flex flex-wrap gap-3">
          {brands.map((brand) => (
            <Badge
              key={brand}
              variant={selectedBrands.includes(brand) ? "default" : "outline"}
              className={`cursor-pointer transition-all px-6 py-3 text-base font-bold ${
                selectedBrands.includes(brand)
                  ? "bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-md"
                  : "border-red-200 text-red-800 hover:border-red-400 hover:bg-red-50 bg-white"
              }`}
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="text-lg font-bold text-red-950 mb-4 block">Tipo de Uso</Label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const tagInfo = TAG_LABELS[tag.nombre]
            const label = tagInfo ? tagInfo.label : tag.nombre
            const isSelected = selectedTags.includes(tag.nombre)
            
            let badgeStyle = {}
            if (isSelected) {
              if (tag.color) {
                badgeStyle = { backgroundColor: tag.color, borderColor: tag.color }
              } else {
                badgeStyle = { backgroundColor: '#dc2626', borderColor: '#dc2626' }
              }
            }

            return (
              <Badge
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all px-6 py-3 text-base font-bold ${
                  isSelected
                    ? "text-white shadow-md"
                    : "border-red-200 text-red-800 hover:border-red-400 hover:bg-red-50 bg-white"
                }`}
                style={badgeStyle}
                onClick={() => toggleTag(tag.nombre)}
              >
                {label}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-lg font-bold text-red-950 mb-6 block">Rango de Precio</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={10000}
            className="my-8 [&_[data-slot=slider-range]]:bg-red-600 [&_[data-slot=slider-thumb]]:border-red-600 [&_[data-slot=slider-thumb]]:ring-red-200"
          />
          <div className="flex justify-between text-sm font-bold text-red-900">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
              {formatPrice(priceRange[0])}
            </span>
            <span className="bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
              {formatPrice(priceRange[1])}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button 
          onClick={applyFilters} 
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg h-12 shadow-lg shadow-red-200 rounded-xl transition-all hover:scale-[1.02]"
        >
          Aplicar Filtros
        </Button>
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 font-medium"
        >
          Limpiar todo
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
            <Button variant="outline" className="w-full bg-white border-red-200 text-red-900 font-bold h-12 shadow-sm">
              <SlidersHorizontal className="w-5 h-5 mr-2 text-red-600" />
              Filtros y Preferencias
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                  {selectedBrands.length +
                    selectedTags.length +
                    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-red-950">Filtros</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="sticky top-24 p-8 rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-50 border border-red-100 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-2xl text-red-950 flex items-center gap-3">
              <SlidersHorizontal className="w-7 h-7 text-red-600" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-100 px-3 rounded-full"
              >
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

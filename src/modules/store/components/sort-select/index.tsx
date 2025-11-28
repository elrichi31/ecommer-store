"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SortOptions } from "../refinement-list/sort-products"

type SortSelectProps = {
  sortBy: SortOptions
}

const sortOptions = [
  { value: "created_at", label: "Más recientes" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
]

export default function SortSelect({ sortBy }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const query = createQueryString("sortBy", e.target.value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={handleChange}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

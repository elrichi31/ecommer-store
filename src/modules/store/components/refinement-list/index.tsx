"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import CategoryFilter from "../category-filter"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  categories?: any[]
}

const RefinementList = ({ sortBy, categories = [], 'data-testid': dataTestId }: RefinementListProps) => {
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

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-6 py-4 mb-8 small:px-4 pl-6 small:min-w-[250px] small:mr-8 bg-gray-50 rounded-lg">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-base font-semibold">Filters</h2>
      </div>
      {categories.length > 0 && <CategoryFilter categories={categories} />}
    </div>
  )
}

export default RefinementList

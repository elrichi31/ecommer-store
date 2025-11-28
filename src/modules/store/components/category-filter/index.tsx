"use client"

import { listCategories } from "@lib/data/categories"
import { Heading } from "@medusajs/ui"
import { ChevronDownMini, ChevronUpMini } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { useState } from "react"

type CategoryFilterProps = {
  categories: any[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  // Filter only parent categories
  const parentCategories = categories.filter((c) => !c.parent_category)

  if (!parentCategories.length) {
    return null
  }

  const isOnStorePage = pathname.endsWith('/store')
  const isInCategory = pathname.includes('/categories/')

  return (
    <div className="py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-base font-medium">Categoría</span>
        {isOpen ? (
          <ChevronUpMini className="text-gray-500" />
        ) : (
          <ChevronDownMini className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <ul className="space-y-2">
          <li>
            <LocalizedClientLink
              href="/store"
              className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                isOnStorePage
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Todas las categorías
            </LocalizedClientLink>
          </li>
          {parentCategories.map((category) => {
            const isActive = pathname.includes(`/categories/${category.handle}`)
            
            return (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

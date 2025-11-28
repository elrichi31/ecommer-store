import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import SortSelect from "@modules/store/components/sort-select"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  // Get all categories for filter
  const categories = await listCategories({ limit: 20 })
  
  // Get product count for this category
  const { response: { count } } = await listProductsWithSort({
    page: 1,
    queryParams: { limit: 1, category_id: [category.id] },
    sortBy: sort,
    countryCode,
  })

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} categories={categories} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex flex-row items-center text-2xl font-semibold gap-2 mb-2">
              {parents &&
                parents.map((parent) => (
                  <span key={parent.id} className="text-gray-400 text-lg">
                    <LocalizedClientLink
                      className="hover:text-gray-600"
                      href={`/categories/${parent.handle}`}
                      data-testid="sort-by-link"
                    >
                      {parent.name}
                    </LocalizedClientLink>
                    <span className="mx-2">/</span>
                  </span>
                ))}
              <h1 data-testid="category-page-title">{category.name}</h1>
            </div>
            <p className="text-sm text-gray-600">Mostrando {count} {count === 1 ? 'producto' : 'productos'}</p>
          </div>
          <div className="flex-shrink-0">
            <SortSelect sortBy={sort} />
          </div>
        </div>
        {category.description && (
          <div className="mb-6 text-sm text-gray-700">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Subcategorías</h3>
            <ul className="flex flex-wrap gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink 
                    href={`/categories/${c.handle}`}
                    className="inline-block px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

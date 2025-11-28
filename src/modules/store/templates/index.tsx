import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import SortSelect from "@modules/store/components/sort-select"
import SearchInput from "@modules/store/components/search-input"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"
import { listProductsWithSort } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchQuery,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchQuery?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategories({ limit: 20 })
  
  // Get all products to count only those with valid prices
  const { response: { products: allProducts } } = await listProductsWithSort({
    page: 1,
    queryParams: { 
      limit: 100, // Get enough products to count
      ...(searchQuery && { q: searchQuery }),
    },
    sortBy: sort,
    countryCode,
  })

  // Count only products with valid prices
  const count = allProducts.filter((product) => {
    const { cheapestPrice } = getProductPrice({ product })
    return cheapestPrice !== null
  }).length

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} categories={categories} />
      <div className="w-full">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold" data-testid="store-page-title">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Todos los productos"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Mostrando {count} {count === 1 ? 'producto' : 'productos'}</p>
            </div>
            <SortSelect sortBy={sort} />
          </div>
          <SearchInput />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            searchQuery={searchQuery}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate

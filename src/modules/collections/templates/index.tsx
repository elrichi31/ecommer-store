import { Suspense } from "react"
import Image from "next/image"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { ExtendedCollection } from "@lib/data/collections"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: ExtendedCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const hasImage = !!collection.image_url
  const hasDescription = !!collection.description

  return (
    <div className="flex flex-col">
      {/* Hero Banner with Collection Image */}
      {hasImage && (
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
          <Image
            src={collection.image_url!}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 drop-shadow-lg">
              {collection.title}
            </h1>
            {hasDescription && (
              <p className="text-base sm:text-lg lg:text-xl max-w-2xl text-white/90 drop-shadow">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
        <RefinementList sortBy={sort} />
        <div className="w-full">
          {/* Title without image banner */}
          {!hasImage && (
            <div className="mb-8">
              <h1 className="text-2xl-semi">{collection.title}</h1>
              {hasDescription && (
                <p className="text-gray-600 mt-2">{collection.description}</p>
              )}
            </div>
          )}
          
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

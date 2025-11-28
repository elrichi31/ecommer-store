import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="content-container py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <LocalizedClientLink href="/" className="hover:text-gray-900">
            Inicio
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store" className="hover:text-gray-900">
            Productos
          </LocalizedClientLink>
          <span>/</span>
          {product.collection && (
            <>
              <LocalizedClientLink 
                href={`/collections/${product.collection.handle}`}
                className="hover:text-gray-900"
              >
                {product.collection.title}
              </LocalizedClientLink>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.title}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div
        className="content-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-6"
        data-testid="product-container"
      >
        {/* Left Side - Images */}
        <div className="w-full">
          <ImageGallery images={images} />
        </div>

        {/* Right Side - Product Info and Actions */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
          <ProductInfo product={product} />
          
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related Products */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

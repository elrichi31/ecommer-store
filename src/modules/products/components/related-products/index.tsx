import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"
import ProductCarousel from "./product-carousel"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .filter((p) => {
        // Only show products with valid prices
        const { cheapestPrice } = getProductPrice({ product: p })
        return cheapestPrice !== null
      })
      .slice(0, 5) // Limit to 5 products
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          También te podría interesar
        </h2>
        <p className="text-sm text-gray-600">
          Productos relacionados que podrían gustarte
        </p>
      </div>

      <ProductCarousel>
        {products.map((product) => (
          <div key={product.id} className="w-64 flex-shrink-0">
            <ProductPreview region={region} product={product} />
          </div>
        ))}
      </ProductCarousel>
    </div>
  )
}

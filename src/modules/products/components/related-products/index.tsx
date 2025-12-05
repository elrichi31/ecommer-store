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

  // Helper function to filter products with valid prices
  const filterProductsWithPrice = (products: HttpTypes.StoreProduct[]) => {
    return products
      .filter((p) => p.id !== product.id)
      .filter((p) => {
        const { cheapestPrice } = getProductPrice({ product: p })
        return cheapestPrice !== null
      })
  }

  let products: HttpTypes.StoreProduct[] = []

  // First try: Get products from same category
  if (product.categories && product.categories.length > 0) {
    const categoryIds = product.categories.map((c) => c.id)
    const { response } = await listProducts({
      queryParams: {
        region_id: region.id,
        category_id: categoryIds,
        is_giftcard: false,
        limit: 10,
      },
      countryCode,
    })
    products = filterProductsWithPrice(response.products)
  }

  // Second try: If no products from category, get products from same collection
  if (products.length < 3 && product.collection_id) {
    const { response } = await listProducts({
      queryParams: {
        region_id: region.id,
        collection_id: [product.collection_id],
        is_giftcard: false,
        limit: 10,
      },
      countryCode,
    })
    const collectionProducts = filterProductsWithPrice(response.products)
    // Add products that aren't already in the list
    for (const p of collectionProducts) {
      if (!products.find((existing) => existing.id === p.id)) {
        products.push(p)
      }
    }
  }

  // Third try: If still not enough, get any products
  if (products.length < 3) {
    const { response } = await listProducts({
      queryParams: {
        region_id: region.id,
        is_giftcard: false,
        limit: 10,
      },
      countryCode,
    })
    const anyProducts = filterProductsWithPrice(response.products)
    // Add products that aren't already in the list
    for (const p of anyProducts) {
      if (!products.find((existing) => existing.id === p.id)) {
        products.push(p)
      }
    }
  }

  // Limit to 10 products
  products = products.slice(0, 10)

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
          <div 
            key={product.id} 
            className="w-[280px] sm:w-[220px] md:w-[200px] lg:w-[calc((100%-80px)/5)] flex-shrink-0"
          >
            <ProductPreview region={region} product={product} />
          </div>
        ))}
      </ProductCarousel>
    </div>
  )
}

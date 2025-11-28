import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-4">
      <Heading
        level="h1"
        className="text-2xl sm:text-3xl font-semibold text-gray-900"
        data-testid="product-title"
      >
        {product.title}
      </Heading>

      {product.description && (
        <Text
          className="text-sm text-gray-600 leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      )}
    </div>
  )
}

export default ProductInfo

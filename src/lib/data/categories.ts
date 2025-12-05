import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Extended category type with image_url from custom endpoint
export type ExtendedCategory = HttpTypes.StoreProductCategory & {
  image_url?: string | null
  children?: ExtendedCategory[]
}

// Response type for extended categories endpoint
type ExtendedCategoriesResponse = {
  categories: ExtendedCategory[]
  count: number
  offset: number
  limit: number
}

export const listCategories = async (query?: Record<string, any>): Promise<ExtendedCategory[]> => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100
  const offset = query?.offset || 0

  try {
    const result = await sdk.client
      .fetch<ExtendedCategoriesResponse>(
        "/store/categories-extended",
        {
          query: {
            limit,
            offset,
            ...query,
          },
          next,
          cache: "force-cache",
        }
      )
    
    return result.categories || []
  } catch (error) {
    console.error("Error fetching extended categories, falling back to standard endpoint:", error)
    
    // Fallback to standard endpoint
    const { product_categories } = await sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            fields: "*category_children, *parent_category",
            limit,
            offset,
            ...query,
          },
          next,
          cache: "force-cache",
        }
      )
    
    return product_categories || []
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]): Promise<ExtendedCategory | null> => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  try {
    const { category } = await sdk.client
      .fetch<{ category: ExtendedCategory }>(
        `/store/categories-extended/${handle}`,
        {
          query: {
            include_children: "true",
            include_parent: "true",
          },
          next,
          cache: "force-cache",
        }
      )

    return category
  } catch (error) {
    // Fallback to standard endpoint if not found
    return sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields: "*category_children, *products",
            handle,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories[0] || null)
  }
}

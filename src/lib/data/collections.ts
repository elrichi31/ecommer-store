"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Extended collection type with image_url and description from custom endpoint
export type ExtendedCollection = HttpTypes.StoreCollection & {
  image_url?: string | null
  description?: string | null
}

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: ExtendedCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: ExtendedCollection[]; count: number }>(
      "/store/collections-extended",
      {
        query: queryParams,
        next,
        cache: "force-cache",
      }
    )
    .then(({ collections, count }) => ({ collections, count }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<ExtendedCollection> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  // Use the specific endpoint for getting collection by handle
  try {
    const { collection } = await sdk.client
      .fetch<{ collection: ExtendedCollection }>(
        `/store/collections-extended/${handle}`,
        {
          next,
          cache: "force-cache",
        }
      )

    if (collection) {
      return collection
    }
  } catch (error) {
    // If not found, fallback to standard endpoint
  }

  // Fallback to standard endpoint if not found
  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0])
}

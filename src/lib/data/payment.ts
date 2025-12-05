"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  console.log("Fetching payment methods for region:", regionId)

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "no-store", // Temporarily disable cache to debug
      }
    )
    .then(({ payment_providers }) => {
      console.log("Payment providers found:", payment_providers)
      return payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    })
    .catch((error) => {
      console.error("Error fetching payment providers:", error)
      return null
    })
}

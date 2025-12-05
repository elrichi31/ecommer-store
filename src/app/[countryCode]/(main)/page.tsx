import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import FeaturedCollections from "@modules/home/components/featured-collections"
import ShopByCategory from "@modules/home/components/shop-by-category"
import Craftsmanship from "@modules/home/components/craftsmanship"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "ETERNA - Elegancia Atemporal",
  description:
    "Descubre piezas icónicas que destacan por su máxima calidad y diseño atemporal.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title, metadata",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedCollections collections={collections} countryCode={countryCode} />
      <Craftsmanship />
      <ShopByCategory countryCode={countryCode} />
    </>
  )
}

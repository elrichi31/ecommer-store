import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"

const DEMO_COLLECTIONS = [
  {
    id: "1",
    title: "Lino de Verano",
    handle: "lino-verano",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a7c3e0e27?w=800&q=80",
  },
  {
    id: "2",
    title: "Esenciales de Cachemira",
    handle: "cachemira",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
  },
  {
    id: "3",
    title: "Iconos Atemporales",
    handle: "atemporales",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
  },
]

export default function FeaturedCollections({
  countryCode,
}: {
  collections?: HttpTypes.StoreCollection[]
  countryCode: string
}) {

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="content-container">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <Heading level="h2" className="text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
            Colecciones Destacadas
          </Heading>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_COLLECTIONS.map((collection) => (
            <Link
              key={collection.id}
              href={`/${countryCode}/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] hover:shadow-xl transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="absolute inset-0">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>

              {/* Collection Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-lg sm:text-xl font-medium mb-1 drop-shadow-lg">
                  {collection.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                  Ver colección →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

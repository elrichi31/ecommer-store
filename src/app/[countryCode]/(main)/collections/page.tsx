import { Metadata } from "next"
import { listCollections, ExtendedCollection } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Colecciones | ETERNA",
  description: "Explora nuestras colecciones exclusivas",
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"

export default async function CollectionsPage() {
  const { collections } = await listCollections()

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          Nuestras Colecciones
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre nuestras colecciones exclusivas, diseñadas para quienes aprecian la elegancia atemporal.
        </p>
      </div>

      {/* Collections Grid */}
      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection: ExtendedCollection) => (
            <LocalizedClientLink
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] hover:shadow-xl transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="absolute inset-0">
                <Image
                  src={collection.image_url || PLACEHOLDER_IMAGE}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>

              {/* Collection Title & Description */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-lg sm:text-xl font-medium mb-1 drop-shadow-lg">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="text-xs sm:text-sm text-white/90 mb-1 line-clamp-2 drop-shadow">
                    {collection.description}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                  Ver colección →
                </p>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay colecciones disponibles.</p>
        </div>
      )}
    </div>
  )
}

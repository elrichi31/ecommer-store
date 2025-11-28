import { listCategories } from "@lib/data/categories"
import { Heading } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"

const CATEGORY_IMAGES: Record<string, string> = {
  camisas: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  pantalones: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
  jerseys: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
  accesorios: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
}

export default async function ShopByCategory({
  countryCode,
}: {
  countryCode: string
}) {
  const categories = await listCategories({ limit: 4 })

  if (!categories || categories.length === 0) {
    return null
  }

  // Filter only parent categories
  const parentCategories = categories.filter((c) => !c.parent_category)

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="content-container">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <Heading level="h2" className="text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
            Comprar por Categoría
          </Heading>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {parentCategories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/${countryCode}/categories/${category.handle}`}
              className="group relative overflow-hidden rounded-lg bg-gray-50 aspect-square hover:shadow-lg transition-all duration-300"
            >
              {/* Category Image */}
              <div className="absolute inset-0">
                <Image
                  src={
                    CATEGORY_IMAGES[category.handle?.toLowerCase() || ""] ||
                    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
                  }
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              </div>

              {/* Category Name */}
              <div className="absolute inset-0 flex items-end justify-center p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-medium text-white text-center drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

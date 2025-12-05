import { Metadata } from "next"
import { listCategories, ExtendedCategory } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Categorías | ETERNA",
  description: "Explora nuestras categorías de productos",
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"

export default async function CategoriesPage() {
  const categories = await listCategories({ parent_category_id: "null" })

  return (
    <div className="content-container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          Categorías
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encuentra exactamente lo que buscas explorando nuestras categorías.
        </p>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: ExtendedCategory) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] hover:shadow-xl transition-all duration-300"
            >
              {/* Category Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image_url || PLACEHOLDER_IMAGE}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              </div>

              {/* Category Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h2 className="text-xl font-medium mb-1 drop-shadow-lg">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-white/90 line-clamp-2 mb-2 drop-shadow">
                    {category.description}
                  </p>
                )}
                
                {/* Subcategories */}
                {category.category_children && category.category_children.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.category_children.slice(0, 3).map((child: ExtendedCategory) => (
                      <span
                        key={child.id}
                        className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded"
                      >
                        {child.name}
                      </span>
                    ))}
                    {category.category_children.length > 3 && (
                      <span className="text-xs text-white/80">
                        +{category.category_children.length - 3} más
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-white/80 group-hover:text-white transition-colors mt-2">
                  Ver productos →
                </p>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay categorías disponibles.</p>
        </div>
      )}
    </div>
  )
}

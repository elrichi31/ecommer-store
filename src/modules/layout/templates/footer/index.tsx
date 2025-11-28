import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full bg-gray-50">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-12 sm:py-16">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-lg font-semibold text-ui-fg-subtle hover:text-ui-fg-base uppercase tracking-wide"
            >
              ETERNA
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-8 md:gap-x-12 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-1.5"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 4).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    return (
                      <li
                        className="text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className="hover:text-ui-fg-base text-sm"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul className="grid grid-cols-1 gap-1.5 text-ui-fg-subtle txt-small">
                  {collections?.slice(0, 4).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Ayuda</span>
              <ul className="grid grid-cols-1 gap-y-1.5 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Contacto
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Envíos
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Devoluciones
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full pb-8 pt-4 border-t border-ui-border-base justify-between text-ui-fg-muted">
          <Text className="text-xs">
            © {new Date().getFullYear()} ETERNA. Todos los derechos reservados.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}

import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
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
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Tienda</span>
              <ul className="grid grid-cols-1 gap-y-1.5 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Todos los productos
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/collections"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Colecciones
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/categories"
                    className="hover:text-ui-fg-base text-sm"
                  >
                    Categorías
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
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

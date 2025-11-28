import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"

export default function Craftsmanship() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop"
              alt="Artesanía y calidad"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-5">
            <Heading level="h2" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              Artesanía y Calidad
            </Heading>

            <Text className="text-base text-gray-700 leading-relaxed">
              Creemos en un lujo que perdura. Cada pieza de nuestra colección está 
              confeccionada con los materiales más finos y una atención al detalle 
              inigualable. Nuestro compromiso es con el diseño atemporal y la 
              artesanía excepcional, creando prendas que no solo visten, sino que 
              cuentan una historia de calidad y herencia.
            </Text>

            <div className="pt-3">
              <Text className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Nuestra Filosofía
              </Text>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Materiales premium seleccionados cuidadosamente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Diseño atemporal que trasciende tendencias</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Atención meticulosa a cada detalle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Compromiso con la sostenibilidad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

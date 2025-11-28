"use client"

import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"
import { useEffect, useState } from "react"

const Hero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        {/* You can replace this with a video tag or your own image */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-out ${
            mounted ? 'scale-100' : 'scale-110'
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </div>
        
        {/* Uncomment below to use video instead of image */}
        {/* 
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        */}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Small brand badge */}
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-light tracking-wider">
                ✦ ETERNA
              </span>
            </div>

            {/* Main Heading */}
            <Heading
              level="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-2xl"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              Elegancia Atemporal,<br />Estilo Duradero
            </Heading>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
              Descubre piezas icónicas que destacan por su máxima calidad y un diseño 
              que trasciende las tendencias
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/store">
                <Button 
                  size="large"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-base sm:text-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 min-w-[220px] rounded-md"
                >
                  Descubrir la Colección
                </Button>
              </Link>
              
              <Link href="/collections">
                <Button 
                  variant="transparent"
                  size="large"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-base sm:text-lg font-medium transition-all duration-300 min-w-[220px] backdrop-blur-sm rounded-md hover:scale-105"
                >
                  Ver Colecciones
                </Button>
              </Link>
            </div>

            {/* Optional: Small tagline or promotional message */}
            <div className="mt-12 sm:mt-16 space-y-2">
              <div className="flex items-center justify-center gap-6 flex-wrap text-white/80 text-xs sm:text-sm uppercase tracking-widest font-light">
                <span>Nueva Temporada</span>
                <span>•</span>
                <span>Envío Gratuito +$100</span>
                <span>•</span>
                <span>Devoluciones 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
          <span className="text-white/60 text-xs uppercase tracking-wider">Scroll</span>
        </div>
      </div>
    </div>
  )
}

export default Hero

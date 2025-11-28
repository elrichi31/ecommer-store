"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      {/* Main Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-lg">
        {images[selectedImage]?.url && (
          <Image
            src={images[selectedImage].url}
            priority
            className="object-cover"
            alt={`Product image ${selectedImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-md bg-gray-100 border-2 transition-all ${
                selectedImage === index
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  className="object-cover"
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="100px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery

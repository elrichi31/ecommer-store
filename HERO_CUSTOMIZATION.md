# 🎨 Guía de Personalización del Hero

## 📸 Cómo Cambiar la Imagen de Fondo

### Opción 1: Usar tu propia imagen (Recomendado)
1. Coloca tu imagen en la carpeta `public/` (ejemplo: `public/hero-bg.jpg`)
2. En el archivo `src/modules/home/components/hero/index.tsx`, cambia:
```tsx
backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')`,
```
Por:
```tsx
backgroundImage: `url('/hero-bg.jpg')`,
```

### Opción 2: Usar una URL externa
Simplemente reemplaza la URL actual con tu imagen preferida de internet.

---

## 🎬 Cómo Usar un Video en Lugar de Imagen

1. Coloca tu video en `public/` (ejemplo: `public/hero-video.mp4`)
2. En el archivo `src/modules/home/components/hero/index.tsx`, busca esta sección:

```tsx
{/* Uncomment below to use video instead of image */}
```

3. **Comenta** el bloque de la imagen (líneas con `backgroundImage`)
4. **Descomenta** el bloque del video:

```tsx
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
```

---

## ✏️ Personalizar Textos

En `src/modules/home/components/hero/index.tsx`, busca y modifica:

### Título Principal
```tsx
Elegancia Atemporal,<br />Estilo Duradero
```

### Subtítulo
```tsx
Descubre piezas icónicas que destacan por su máxima calidad y un diseño 
que trasciende las tendencias
```

### Badge Superior
```tsx
✦ ETERNA
```

### Botones
```tsx
Descubrir la Colección  // Botón principal
Ver Colecciones         // Botón secundario
```

### Mensaje Promocional
```tsx
Nueva Temporada • Envío Gratuito +$100 • Devoluciones 30 días
```

---

## 🎨 Ajustar Colores y Estilos

### Cambiar overlay oscuro
Busca esta línea y ajusta el valor de opacidad:
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
```
- `/30` = 30% opacidad
- `/20` = 20% opacidad
- `/40` = 40% opacidad

### Cambiar color de botones
**Botón Principal (blanco):**
```tsx
className="bg-white text-black hover:bg-gray-100 ..."
```

**Botón Secundario (transparente con borde):**
```tsx
className="border-2 border-white text-white hover:bg-white hover:text-black ..."
```

---

## 🔧 Ajustes Avanzados

### Cambiar altura del hero
En la primera línea del componente:
```tsx
<div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
```
- `h-[85vh]` = 85% de la altura de la ventana
- `min-h-[600px]` = mínimo 600 píxeles

### Modificar animaciones
Las animaciones están definidas en `src/styles/globals.css`:
- `fadeInUp` - Entrada suave desde abajo
- `scaleIn` - Zoom suave en la imagen
- `bounce` - Indicador de scroll

---

## 📱 Responsive Design
El hero ya está optimizado para todos los dispositivos:
- Mobile: Botones apilados verticalmente
- Tablet/Desktop: Botones en línea horizontal
- El texto se ajusta automáticamente

---

## 🚀 Próximos Pasos Recomendados

1. **Optimiza tus imágenes**: Usa formato WebP para mejor rendimiento
2. **Videos**: Mantén videos bajo 5MB para carga rápida
3. **A/B Testing**: Prueba diferentes textos y CTAs
4. **Accesibilidad**: Mantén buen contraste entre texto y fondo

---

## 📚 Recursos Útiles

- [Unsplash](https://unsplash.com/) - Imágenes gratuitas de alta calidad
- [Pexels](https://www.pexels.com/) - Videos gratuitos para hero
- [TinyPNG](https://tinypng.com/) - Optimizador de imágenes
- [Cloudinary](https://cloudinary.com/) - Hosting de imágenes con CDN

---

¿Necesitas ayuda? Abre un issue o consulta la documentación de Next.js para más opciones.

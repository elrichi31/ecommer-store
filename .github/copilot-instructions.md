# Medusa Next.js Storefront - AI Coding Instructions

## 🚨 CRITICAL: Communication & Coding Principles

### NEVER Create Documentation Files
- **NEVER create `.md` files** to document changes or summarize work
- Instead: Provide a **brief summary** (2-3 sentences) in the response
- Exception: Only if explicitly requested by the user

### ⚠️ NEVER Modify Backend Data Integration
- **NEVER remove or replace code that fetches/displays data from the backend**
- If a component uses `product.material`, `product.weight`, `region.name`, etc. → **KEEP IT**
- Only add fallback text if the backend field is empty (e.g., `product.material || "-"`)
- Before making UI changes, **always check** if existing code pulls data from Medusa backend
- Hardcoded/static text can be modified, but dynamic backend data must be preserved
- When in doubt, **ask the user** before removing any data integration

### Core Development Principles
- **KISS (Keep It Simple, Stupid)**: Always choose the simplest solution that works
- **DRY (Don't Repeat Yourself)**: Never duplicate code - create reusable components/functions
- **Component Extraction**: If code appears 2+ times, extract it into a shared component
- **Minimal Changes**: Make the smallest change that achieves the goal

### Code Organization Rules
1. **Spot repetition?** → Create a component in `src/modules/common/components/`
2. **Shared logic?** → Extract to utility function in `src/lib/util/`
3. **Repeated Server Action pattern?** → Create reusable helper in `src/lib/data/`
4. **Complex component?** → Split into smaller, focused sub-components

## Architecture Overview

This is a **Next.js 15 App Router** storefront for **Medusa v2** ecommerce platform. It uses React Server Components (RSC), Server Actions, and the Medusa JS SDK for backend communication.

### Core Dependencies
- **Next.js 15** with Turbopack and App Router
- **React 19 RC** with Server Components/Actions
- **Medusa JS SDK** (`@medusajs/js-sdk`) - API client
- **Medusa UI** - Pre-built components
- **Tailwind CSS** - Styling
- **Stripe** - Payment processing

## Critical Architecture Patterns

### 1. Region-Based Routing (`[countryCode]` Dynamic Segment)
All routes are prefixed with country code (e.g., `/us/products`, `/ca/cart`). The **middleware** (`src/middleware.ts`) handles:
- Auto-detecting user region from Vercel headers or defaults
- Redirecting users to region-specific URLs
- Managing `_medusa_cache_id` cookie for cache segmentation
- Fetching regions from Medusa backend on Edge runtime

**Key Pattern**: Always use `countryCode` param in route handlers and pass it to data fetching functions.

```tsx
// Example route structure
src/app/[countryCode]/(main)/products/[handle]/page.tsx
```

### 2. Server Actions Pattern (`"use server"`)
All API calls to Medusa backend are in **Server Actions** located in `src/lib/data/`:
- `cart.ts` - Cart operations (add, update, retrieve)
- `products.ts` - Product listing and details
- `customer.ts` - Authentication and profile
- `orders.ts` - Order management
- `regions.ts` - Region/country data
- `collections.ts`, `categories.ts`, etc.

**Always use Server Actions for:**
- Fetching data from Medusa backend
- Mutations (add to cart, checkout, etc.)
- Operations requiring auth headers or cache management

```tsx
// Example Server Action usage
import { retrieveCart, addToCart } from "@lib/data/cart"
```

### 3. Cookie-Based State Management
Critical cookies managed in `src/lib/data/cookies.ts`:
- `_medusa_jwt` - Auth token (httpOnly, 7 days)
- `_medusa_cart_id` - Cart persistence (httpOnly, 7 days)
- `_medusa_cache_id` - Cache segmentation per user session

**Never access cookies directly**. Always use helper functions: `getAuthHeaders()`, `getCartId()`, `setCartId()`, `getCacheTag()`, etc.

### 4. Medusa SDK Configuration
SDK instance in `src/lib/config.ts` - singleton pattern:
```typescript
export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

Use `sdk.store.*` for API calls in Server Actions. SDK handles auth automatically when headers are passed.

### 5. Caching Strategy
- **Server Components**: Use Next.js `cache: "force-cache"` with `revalidateTag()`
- **Dynamic data**: Tag caches with `_medusa_cache_id` for per-user invalidation
- **Cart updates**: Always call `revalidateTag(await getCacheTag("carts"))` after mutations

## Development Workflow

### Environment Setup
Required env vars (checked in `check-env-variables.js`):
```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...  # Required - get from Medusa Admin
MEDUSA_BACKEND_URL=http://localhost:9000   # Default if not set
NEXT_PUBLIC_STRIPE_KEY=pk_test_...         # For Stripe payments
NEXT_PUBLIC_DEFAULT_REGION=us              # Fallback region
```

### Running the Project
```bash
yarn dev          # Starts on port 8000 with Turbopack
yarn build        # Production build
yarn start        # Production server on port 8000
```

**Important**: Medusa backend must be running on port 9000 before starting storefront.

### Module Structure
Features are organized in `src/modules/`:
- `account/` - User authentication, profile, orders
- `cart/` - Cart display and item management
- `checkout/` - Multi-step checkout flow
- `products/` - Product display, variants, actions
- `layout/` - Nav, Footer, global components
- `common/` - Shared components and icons

Each module has `components/` and `templates/` subdirectories. Templates are page-level layouts.

## Key Conventions

### Component Patterns
1. **Server Components by default** - Use `"use client"` only when needed (forms, interactivity)
2. **Server Actions for mutations** - Client components import and call Server Actions
3. **Metadata exports** - Add `export const metadata` to page components for SEO

Example:
```tsx
// Server Component (default)
export const metadata = { title: "Products" }
export default async function Page() {
  const products = await listProducts() // Server Action
  return <ProductList products={products} />
}

// Client Component (when interactive)
"use client"
import { addToCart } from "@lib/data/cart"
export default function AddButton({ variantId }) {
  return <button onClick={() => addToCart(variantId)}>Add</button>
}
```

### Data Fetching Pattern
Always pass `countryCode` and `region` from route params:
```tsx
const region = await getRegion(countryCode)
const products = await listProducts({ countryCode, queryParams: {...} })
```

### Form Handling with Server Actions
Use `useActionState` hook for form submissions:
```tsx
"use client"
import { useActionState } from "react"
import { submitAddress } from "@lib/data/cart"

const [message, formAction] = useActionState(submitAddress, null)
return <form action={formAction}>...</form>
```

### Styling Patterns
- Use Medusa UI components: `Button`, `Heading`, `Text`, `Label`, etc.
- Custom utility classes in `src/styles/globals.css`: `content-container`, `text-*-regular`
- Tailwind for layout and spacing
- Component-specific styles inline with `className`

### Route Groups
- `(main)/` - Standard pages with Nav/Footer
- `(checkout)/` - Checkout flow (minimal layout)
- `@login`, `@dashboard` - Parallel routes for account section

## Common Gotchas

1. **Middleware runs on Edge** - Can't use Node-specific APIs, hence direct fetch to Medusa instead of SDK
2. **TypeScript errors ignored** - `typescript.ignoreBuildErrors: true` in `next.config.js`
3. **Image domains** - Add remote image sources to `next.config.js` under `images.remotePatterns`
4. **Cart region mismatch** - Cart region auto-updates to match current country code
5. **Static generation** - Product pages use `generateStaticParams()` for ISR

## Integration Points

### Stripe Payment
- Client-side: `@stripe/react-stripe-js` and `@stripe/stripe-js`
- Elements wrap checkout payment step
- Backend handles payment intent creation

### Medusa Backend Communication
- All requests go through SDK in Server Actions
- Auth headers attached via `getAuthHeaders()` from cookies
- Publishable API key required for all requests

## Testing & Debugging

- **Dev mode logging**: SDK has `debug: true` in development
- **Fetch logging**: Next.js logs full URLs in dev (`logging.fetches.fullUrl`)
- **Cache debugging**: Check cache tags with `_medusa_cache_id` cookie value

## Custom Modifications (ETERNA Brand)

The storefront has been customized for "ETERNA" brand:
- **Hero section**: `src/modules/home/components/hero/index.tsx` - Elegant landing with CTA buttons
- **Custom animations**: Added to `src/styles/globals.css` (fadeInUp, scaleIn)
- **Branding**: Replace placeholder text/images with brand assets
- **Customization guide**: See `HERO_CUSTOMIZATION.md` for changing images/videos/text

When making UI changes, maintain the elegant, timeless aesthetic consistent with ETERNA branding.

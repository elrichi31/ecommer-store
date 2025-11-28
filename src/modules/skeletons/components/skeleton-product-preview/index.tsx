import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <Container className="aspect-[4/5] w-full bg-gray-100 bg-ui-bg-subtle rounded-large" />
      <div className="flex justify-between text-base-regular mt-4">
        <div className="w-2/5 h-4 bg-gray-100 rounded"></div>
        <div className="w-1/5 h-4 bg-gray-100 rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview

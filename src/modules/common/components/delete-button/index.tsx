"use client"

import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState, useTransition } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (lineId: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItem(lineId)
    } catch (err) {
      console.error("Error deleting item:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => startTransition(() => handleDelete(id))}
        disabled={isDeleting || isPending}
        type="button"
      >
        {isDeleting || isPending ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton

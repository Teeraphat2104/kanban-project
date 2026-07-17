"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CardDialog } from "./CardDialog"
import type { Card } from "@/types"

export function CardItem({ card, columnId }: { card: Card; columnId: string }) {
  const [open, setOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setOpen(true)}
        className="cursor-grab rounded-lg border bg-card p-3 text-sm shadow-sm hover:border-primary/50 active:cursor-grabbing"
      >
        <p className="font-medium">{card.title}</p>
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {card.description}
          </p>
        )}
      </div>
      <CardDialog
        card={card}
        columnId={columnId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

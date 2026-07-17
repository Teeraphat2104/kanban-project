"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTags, useCardTags } from "@/hooks/use-tags"
import { CardDialog } from "./CardDialog"
import { TagBadge } from "./TagBadge"
import type { Card } from "@/types"

export function CardItem({
  card,
  columnId,
  boardId,
}: {
  card: Card
  columnId: string
  boardId: string
}) {
  const [open, setOpen] = useState(false)
  const { data: allTags } = useTags(boardId)
  const { data: cardTagIds } = useCardTags(card.id)

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

  const cardTags = allTags?.filter((t) => cardTagIds?.includes(t.id)) ?? []

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
        {cardTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {cardTags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <CardDialog
        card={card}
        columnId={columnId}
        boardId={boardId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

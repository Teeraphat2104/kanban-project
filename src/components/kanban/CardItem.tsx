"use client"

import { useState } from "react"
import { format, isPast, isToday } from "date-fns"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTags, useCardTags } from "@/hooks/use-tags"
import { useCardAssignees, useCurrentUser } from "@/hooks/use-assignees"
import { CardDialog } from "./CardDialog"
import { TagBadge } from "./TagBadge"
import { CalendarIcon, UserIcon } from "lucide-react"
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
  const { data: assigneeIds } = useCardAssignees(card.id)
  const { data: currentUser } = useCurrentUser()

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
  const isAssigned = currentUser?.id ? assigneeIds?.includes(currentUser.id) : false

  const dueDate = card.due_date ? new Date(card.due_date) : null
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate)
  const isDueToday = dueDate && isToday(dueDate)

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

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {dueDate && (
            <span
              className={`inline-flex items-center gap-1 ${
                isOverdue
                  ? "text-destructive"
                  : isDueToday
                    ? "text-amber-500"
                    : ""
              }`}
            >
              <CalendarIcon className="size-3" />
              {isToday(dueDate)
                ? "Today"
                : isPast(dueDate)
                  ? format(dueDate, "MMM d")
                  : format(dueDate, "MMM d")}
            </span>
          )}
          {isAssigned && (
            <span className="inline-flex items-center gap-1">
              <UserIcon className="size-3" />
              Me
            </span>
          )}
        </div>
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

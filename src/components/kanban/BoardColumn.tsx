"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useUpdateColumn, useDeleteColumn } from "@/hooks/use-columns"
import { CardItem } from "./CardItem"
import { CardDialog } from "./CardDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react"
import type { Column, Card } from "@/types"

export function BoardColumn({
  column,
  boardId,
  cards,
}: {
  column: Column
  boardId: string
  cards: Card[]
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const updateColumn = useUpdateColumn()
  const deleteColumn = useDeleteColumn()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleRename = async () => {
    if (title.trim() && title !== column.title) {
      await updateColumn.mutateAsync({ id: column.id, title })
    }
    setEditing(false)
  }

  const nextPosition = cards.length
    ? Math.max(...cards.map((c) => c.position)) + 1
    : 0

  return (
    <div ref={setNodeRef} style={style} className="flex w-72 shrink-0 flex-col gap-3">
      <div
        className="flex items-center justify-between px-1"
        {...attributes}
        {...listeners}
      >
        {editing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="h-7 text-sm font-semibold"
            autoFocus
          />
        ) : (
          <h3
            className="cursor-pointer text-sm font-semibold"
            onClick={() => setEditing(true)}
          >
            {column.title}
          </h3>
        )}

        <div className="flex items-center gap-1">
          <CardDialog columnId={column.id} nextPosition={nextPosition}>
            <Button variant="ghost" size="icon-xs">
              <Plus className="size-4" />
            </Button>
          </CardDialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="mr-2 size-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-2 min-h-[200px]">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <CardItem key={card.id} card={card} columnId={column.id} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No cards yet
          </p>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete column</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{column.title}&quot;? All cards
            in this column will also be deleted.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteColumn.mutateAsync({ id: column.id, boardId })
                setDeleteOpen(false)
              }}
              disabled={deleteColumn.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

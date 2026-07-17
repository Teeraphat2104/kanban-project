"use client"

import { useState } from "react"
import { useUpdateColumn, useDeleteColumn } from "@/hooks/use-columns"
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Column } from "@/types"

export function BoardColumn({ column, boardId }: { column: Column; boardId: string }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const updateColumn = useUpdateColumn()
  const deleteColumn = useDeleteColumn()

  const handleRename = async () => {
    if (title.trim() && title !== column.title) {
      await updateColumn.mutateAsync({ id: column.id, title })
    }
    setEditing(false)
  }

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm">
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

      <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-2 min-h-[200px]">
        {/* Cards will go here */}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete column</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{column.title}&quot;? All cards in this column will also be deleted.
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

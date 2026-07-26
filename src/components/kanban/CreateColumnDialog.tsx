"use client"

import { useState } from "react"
import { useCreateColumn } from "@/hooks/use-columns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateColumnDialog({ boardId, nextPosition }: { boardId: string; nextPosition: number }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const createColumn = useCreateColumn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createColumn.mutateAsync({ board_id: boardId, title, position: nextPosition })
    setTitle("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>+ Add Column</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="To Do"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={createColumn.isPending}>
            {createColumn.isPending ? "Adding..." : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { useCreateCard, useUpdateCard, useDeleteCard } from "@/hooks/use-cards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Card } from "@/types"

export function CardDialog({
  card,
  columnId,
  children,
  nextPosition,
}: {
  card?: Card
  columnId: string
  children: React.ReactNode
  nextPosition?: number
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(card?.title ?? "")
  const [description, setDescription] = useState(card?.description ?? "")
  const createCard = useCreateCard()
  const updateCard = useUpdateCard()
  const deleteCard = useDeleteCard()

  const isNew = !card

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew) {
      await createCard.mutateAsync({
        column_id: columnId,
        title,
        description: description || undefined,
        position: nextPosition ?? 0,
      })
    } else {
      await updateCard.mutateAsync({ id: card.id, title, description: description || null } as any)
    }
    setTitle("")
    setDescription("")
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!card) return
    await deleteCard.mutateAsync({ id: card.id, columnId })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Create card" : "Edit card"}</DialogTitle>
          {!isNew && <DialogDescription>Edit card details below.</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              placeholder="Card title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="card-desc">Description</Label>
            <Textarea
              id="card-desc"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteCard.isPending}
              >
                Delete
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCard.isPending || updateCard.isPending}>
                {isNew ? "Create" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

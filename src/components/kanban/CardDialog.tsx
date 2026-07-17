"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useCreateCard, useUpdateCard, useDeleteCard } from "@/hooks/use-cards"
import {
  useCardAssignees,
  useCurrentUser,
  useToggleAssignee,
} from "@/hooks/use-assignees"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TagSelector } from "./TagSelector"
import type { Card } from "@/types"

export function CardDialog({
  card,
  columnId,
  boardId,
  children,
  nextPosition,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  card?: Card
  columnId: string
  boardId?: string
  children?: React.ReactNode
  nextPosition?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [title, setTitle] = useState(card?.title ?? "")
  const [description, setDescription] = useState(card?.description ?? "")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    card?.due_date ? new Date(card.due_date) : undefined
  )
  const { data: currentUser } = useCurrentUser()
  const { data: assigneeIds } = useCardAssignees(card?.id ?? "")
  const toggleAssignee = useToggleAssignee()
  const createCard = useCreateCard()
  const updateCard = useUpdateCard()
  const deleteCard = useDeleteCard()

  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const isNew = !card

  const isAssignedToMe = currentUser?.id
    ? assigneeIds?.includes(currentUser.id) ?? false
    : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew && nextPosition !== undefined) {
      await createCard.mutateAsync({
        column_id: columnId,
        title,
        description: description || undefined,
        position: nextPosition,
      })
    } else if (!isNew) {
      await updateCard.mutateAsync({
        id: card.id,
        title,
        description: description || null,
        due_date: dueDate ? dueDate.toISOString() : null,
      } as any)
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

  const handleToggleAssignee = async () => {
    if (!card || !currentUser) return
    await toggleAssignee.mutateAsync({
      card_id: card.id,
      user_id: currentUser.id,
      add: !isAssignedToMe,
    })
  }

  const form = (
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

      <div className="grid gap-2">
        <Label>Due date</Label>
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 size-4" />
              {dueDate ? format(dueDate, "PPP") : "Set due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
            />
          </PopoverContent>
        </Popover>
        {dueDate && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setDueDate(undefined)}
            className="w-fit"
          >
            Clear date
          </Button>
        )}
      </div>

      {!isNew && currentUser && (
        <div className="grid gap-2">
          <Label>Assignee</Label>
          <Button
            type="button"
            variant={isAssignedToMe ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAssignee}
            disabled={toggleAssignee.isPending}
            className="w-fit"
          >
            {isAssignedToMe ? "Assigned to me" : "Assign to me"}
          </Button>
        </div>
      )}

      {!isNew && boardId && card && (
        <TagSelector boardId={boardId} cardId={card.id} />
      )}

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
          <Button
            type="submit"
            disabled={createCard.isPending || updateCard.isPending}
          >
            {isNew ? "Create" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  )

  const content = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isNew ? "Create card" : "Edit card"}</DialogTitle>
        {!isNew && (
          <DialogDescription>Edit card details below.</DialogDescription>
        )}
      </DialogHeader>
      {form}
    </DialogContent>
  )

  if (children) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {content}
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { useBoard } from "@/hooks/use-boards"
import { useColumns } from "@/hooks/use-columns"
import { useBoardCards } from "@/hooks/use-cards"
import { useUpdateCard } from "@/hooks/use-cards"
import { useUpdateColumn } from "@/hooks/use-columns"
import { BoardColumn } from "./BoardColumn"
import { CreateColumnDialog } from "./CreateColumnDialog"

export function KanbanBoard({ boardId }: { boardId: string }) {
  const { data: board, isLoading: boardLoading } = useBoard(boardId)
  const { data: columns, isLoading: colsLoading } = useColumns(boardId)
  const { data: allCards, isLoading: cardsLoading } = useBoardCards(boardId)
  const [activeId, setActiveId] = useState<string | null>(null)
  const updateCard = useUpdateCard()
  const updateColumn = useUpdateColumn()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const cardsByColumn = new Map<string, typeof allCards>()
  columns?.forEach((col) => {
    cardsByColumn.set(
      col.id,
      (allCards ?? []).filter((c) => c.column_id === col.id)
    )
  })

  const findColumn = (id: string): string | undefined => {
    if (columns?.some((c) => c.id === id)) return id
    const card = allCards?.find((c) => c.id === id)
    return card?.column_id
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !columns || !allCards) return

    const activeCol = findColumn(active.id as string)
    const overCol = findColumn(over.id as string)

    if (!activeCol || !overCol || activeCol === overCol) return

    setActiveId(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || !columns || !allCards) return

    const activeIdStr = active.id as string
    const overIdStr = over.id as string

    const activeCol = findColumn(activeIdStr)
    const overCol = findColumn(overIdStr)

    if (!activeCol || !overCol) return

    // Column reorder
    if (activeCol === activeIdStr && overCol === overIdStr) {
      const oldIdx = columns.findIndex((c) => c.id === activeIdStr)
      const newIdx = columns.findIndex((c) => c.id === overIdStr)
      if (oldIdx !== newIdx) {
        const reordered = arrayMove(columns, oldIdx, newIdx)
        reordered.forEach((col, i) => {
          updateColumn.mutateAsync({ id: col.id, position: i } as any)
        })
      }
      return
    }

    // Card reorder/move
    const activeCards = cardsByColumn.get(activeCol) ?? []
    const activeIdx = activeCards.findIndex((c) => c.id === activeIdStr)

    if (activeCol === overCol) {
      const overIdx = activeCards.findIndex((c) => c.id === overIdStr)
      if (activeIdx !== overIdx && overIdx !== -1) {
        const reordered = arrayMove(activeCards, activeIdx, overIdx)
        reordered.forEach((card, i) => {
          updateCard.mutateAsync({
            id: card.id,
            position: i,
            column_id: activeCol,
          } as any)
        })
      }
    } else {
      const overCards = cardsByColumn.get(overCol) ?? []
      const overIdx = overCards.findIndex((c) => c.id === overIdStr)
      const card = activeCards[activeIdx]
      if (card) {
        const newOverCards = [
          ...overCards.slice(0, overIdx === -1 ? overCards.length : overIdx),
          card,
          ...overCards.slice(overIdx === -1 ? overCards.length : overIdx),
        ]
        newOverCards.forEach((c, i) => {
          updateCard.mutateAsync({
            id: c.id,
            position: i,
            column_id: c.id === card.id ? overCol : c.column_id,
          } as any)
        })
        const remainingCards = activeCards.filter((c) => c.id !== card.id)
        remainingCards.forEach((c, i) => {
          updateCard.mutateAsync({ id: c.id, position: i } as any)
        })
      }
    }
  }

  if (boardLoading || colsLoading || cardsLoading) {
    return <p className="p-6 text-muted-foreground">Loading board...</p>
  }

  if (!board) {
    return <p className="p-6 text-destructive">Board not found</p>
  }

  const nextPosition = columns?.length ? columns[columns.length - 1].position + 1 : 0

  const activeCard = activeId ? allCards?.find((c) => c.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{board.title}</h1>
            {board.description && (
              <p className="text-sm text-muted-foreground">{board.description}</p>
            )}
          </div>
          <CreateColumnDialog boardId={boardId} nextPosition={nextPosition} />
        </div>

        <SortableContext
          items={columns?.map((c) => c.id) ?? []}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns?.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                boardId={boardId}
                cards={cardsByColumn.get(column.id) ?? []}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="rounded-lg border bg-card p-3 text-sm shadow-lg">
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

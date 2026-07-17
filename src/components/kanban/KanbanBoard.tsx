"use client"

import { useBoard } from "@/hooks/use-boards"
import { useColumns } from "@/hooks/use-columns"
import { BoardColumn } from "./BoardColumn"
import { CreateColumnDialog } from "./CreateColumnDialog"

export function KanbanBoard({ boardId }: { boardId: string }) {
  const { data: board, isLoading: boardLoading } = useBoard(boardId)
  const { data: columns, isLoading: colsLoading } = useColumns(boardId)

  if (boardLoading || colsLoading) {
    return <p className="p-6 text-muted-foreground">Loading board...</p>
  }

  if (!board) {
    return <p className="p-6 text-destructive">Board not found</p>
  }

  const nextPosition = columns?.length ? columns[columns.length - 1].position + 1 : 0

  return (
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

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns?.map((column) => (
          <BoardColumn key={column.id} column={column} boardId={boardId} />
        ))}
      </div>
    </div>
  )
}

"use client"

import { useBoards } from "@/hooks/use-boards"
import { BoardCard } from "@/components/boards/BoardCard"
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog"

export default function BoardsPage() {
  const { data: boards, isLoading, error } = useBoards()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boards</h1>
        <CreateBoardDialog />
      </div>

      {isLoading && <p className="text-muted-foreground">Loading boards...</p>}
      {error && <p className="text-destructive">Error: {(error as Error).message}</p>}

      {boards && boards.length === 0 && (
        <p className="text-muted-foreground">
          No boards yet. Create your first board to get started.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards?.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  )
}

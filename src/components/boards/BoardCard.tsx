"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EditBoardDialog } from "./EditBoardDialog"
import { DeleteBoardDialog } from "./DeleteBoardDialog"
import type { Board } from "@/types"

export function BoardCard({ board }: { board: Board }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/boards/${board.id}`}>
              <CardTitle className="hover:underline">{board.title}</CardTitle>
            </Link>
            {board.description && (
              <CardDescription>{board.description}</CardDescription>
            )}
          </div>
          <div className="flex gap-1">
            <EditBoardDialog board={board} />
            <DeleteBoardDialog boardId={board.id} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Created {new Date(board.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}

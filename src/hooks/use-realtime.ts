"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const sb = createClient()

export function useBoardRealtime(boardId: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!boardId) return

    const channel = sb
      .channel(`board-${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "columns",
          filter: `board_id=eq.${boardId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["columns", boardId] })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
        },
        () => {
          qc.invalidateQueries({ queryKey: ["board-cards", boardId] })
          qc.invalidateQueries({ queryKey: ["cards"] })
        }
      )
      .subscribe()

    return () => {
      sb.removeChannel(channel)
    }
  }, [boardId, qc])
}

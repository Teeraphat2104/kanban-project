"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Column } from "@/types"

const sb = createClient()

export function useColumns(boardId: string) {
  return useQuery({
    queryKey: ["columns", boardId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("columns")
        .select("*")
        .eq("board_id", boardId)
        .order("position", { ascending: true })

      if (error) throw error
      return (data ?? []) as Column[]
    },
    enabled: !!boardId,
  })
}

export function useCreateColumn() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { board_id: string; title: string; position: number }) => {
      const { data, error } = await sb
        .from("columns")
        .insert({ board_id: input.board_id, title: input.title, position: input.position })
        .select()
        .single()

      if (error) throw error
      return data as Column
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["columns", data.board_id] })
    },
  })
}

export function useUpdateColumn() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; title?: string; position?: number }) => {
      const updates: Record<string, string | number> = {}
      if (input.title !== undefined) updates.title = input.title
      if (input.position !== undefined) updates.position = input.position

      const { data, error } = await sb
        .from("columns")
        .update(updates)
        .eq("id", input.id)
        .select()
        .single()

      if (error) throw error
      return data as Column
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["columns"] })
    },
  })
}

export function useDeleteColumn() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; boardId: string }) => {
      const { error } = await sb.from("columns").delete().eq("id", input.id)
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["columns", vars.boardId] })
    },
  })
}

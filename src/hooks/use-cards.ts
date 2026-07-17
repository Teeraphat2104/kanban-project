"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Card } from "@/types"

const sb = createClient()

export function useCards(columnId: string) {
  return useQuery({
    queryKey: ["cards", columnId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("cards")
        .select("*")
        .eq("column_id", columnId)
        .order("position", { ascending: true })

      if (error) throw error
      return (data ?? []) as Card[]
    },
    enabled: !!columnId,
  })
}

export function useBoardCards(boardId: string) {
  return useQuery({
    queryKey: ["board-cards", boardId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("cards")
        .select("*")
        .in(
          "column_id",
          sb.from("columns").select("id").eq("board_id", boardId).then((r) =>
            (r.data ?? []).map((c: any) => c.id)
          ) as any
        )
        .order("position", { ascending: true })

      if (error) throw error
      return (data ?? []) as Card[]
    },
    enabled: !!boardId,
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ["cards", id],
    queryFn: async () => {
      const { data, error } = await sb
        .from("cards")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data as Card
    },
    enabled: !!id,
  })
}

export function useCreateCard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      column_id: string
      title: string
      description?: string
      position: number
    }) => {
      const { data, error } = await sb
        .from("cards")
        .insert({
          column_id: input.column_id,
          title: input.title,
          description: input.description ?? null,
          position: input.position,
        })
        .select()
        .single()

      if (error) throw error
      return data as Card
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cards", data.column_id] })
      qc.invalidateQueries({ queryKey: ["board-cards"] })
    },
  })
}

export function useUpdateCard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Card> & { id: string }) => {
      const updates: Record<string, any> = { ...input }
      delete updates.id

      const { data, error } = await sb
        .from("cards")
        .update(updates)
        .eq("id", input.id)
        .select()
        .single()

      if (error) throw error
      return data as Card
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cards", data.column_id] })
      qc.invalidateQueries({ queryKey: ["board-cards"] })
    },
  })
}

export function useDeleteCard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; columnId: string }) => {
      const { error } = await sb.from("cards").delete().eq("id", input.id)
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["cards", vars.columnId] })
      qc.invalidateQueries({ queryKey: ["board-cards"] })
    },
  })
}

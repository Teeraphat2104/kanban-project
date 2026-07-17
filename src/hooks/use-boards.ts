"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Board } from "@/types"

const sb = createClient()

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("boards")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data ?? []) as Board[]
    },
  })
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: async () => {
      const { data, error } = await sb
        .from("boards")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data as Board
    },
    enabled: !!id,
  })
}

export function useCreateBoard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { title: string; description?: string }) => {
      const { data, error } = await sb
        .from("boards")
        .insert({ title: input.title, description: input.description ?? null })
        .select()
        .single()

      if (error) throw error
      return data as Board
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] })
    },
  })
}

export function useUpdateBoard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; title?: string; description?: string }) => {
      const updates: Record<string, string> = {}
      if (input.title !== undefined) updates.title = input.title
      if (input.description !== undefined) updates.description = input.description

      const { data, error } = await sb
        .from("boards")
        .update(updates)
        .eq("id", input.id)
        .select()
        .single()

      if (error) throw error
      return data as Board
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["boards"] })
      qc.invalidateQueries({ queryKey: ["boards", data.id] })
    },
  })
}

export function useDeleteBoard() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("boards").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] })
    },
  })
}

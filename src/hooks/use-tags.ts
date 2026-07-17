"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Tag } from "@/types"

const sb = createClient()

export function useTags(boardId: string) {
  return useQuery({
    queryKey: ["tags", boardId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("tags")
        .select("*")
        .eq("board_id", boardId)
      if (error) throw error
      return (data ?? []) as Tag[]
    },
    enabled: !!boardId,
  })
}

export function useCardTags(cardId: string) {
  return useQuery({
    queryKey: ["card-tags", cardId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("card_tags")
        .select("tag_id")
        .eq("card_id", cardId)
      if (error) throw error
      return (data ?? []).map((r: any) => r.tag_id) as string[]
    },
    enabled: !!cardId,
  })
}

export function useCreateTag() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { board_id: string; name: string; color: string }) => {
      const { data, error } = await sb
        .from("tags")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Tag
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["tags", data.board_id] })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; boardId: string }) => {
      const { error } = await sb.from("tags").delete().eq("id", input.id)
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["tags", vars.boardId] })
      qc.invalidateQueries({ queryKey: ["card-tags"] })
    },
  })
}

export function useToggleCardTag() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { card_id: string; tag_id: string; add: boolean }) => {
      if (input.add) {
        const { error } = await sb.from("card_tags").insert({
          card_id: input.card_id,
          tag_id: input.tag_id,
        })
        if (error) throw error
      } else {
        const { error } = await sb
          .from("card_tags")
          .delete()
          .eq("card_id", input.card_id)
          .eq("tag_id", input.tag_id)
        if (error) throw error
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["card-tags", vars.card_id] })
    },
  })
}

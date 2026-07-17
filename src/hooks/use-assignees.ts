"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const sb = createClient()

export function useCardAssignees(cardId: string) {
  return useQuery({
    queryKey: ["card-assignees", cardId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("card_assignees")
        .select("user_id")
        .eq("card_id", cardId)
      if (error) throw error
      return ((data ?? []).map((r: any) => r.user_id) ?? []) as string[]
    },
    enabled: !!cardId,
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await sb.auth.getUser()
      return user ?? null
    },
  })
}

export function useToggleAssignee() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { card_id: string; user_id: string; add: boolean }) => {
      if (input.add) {
        const { error } = await sb
          .from("card_assignees")
          .insert({ card_id: input.card_id, user_id: input.user_id })
        if (error) throw error
      } else {
        const { error } = await sb
          .from("card_assignees")
          .delete()
          .eq("card_id", input.card_id)
          .eq("user_id", input.user_id)
        if (error) throw error
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["card-assignees", vars.card_id] })
    },
  })
}

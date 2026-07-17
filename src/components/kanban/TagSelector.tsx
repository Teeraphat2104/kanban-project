"use client"

import { useTags, useCardTags, useToggleCardTag, useCreateTag } from "@/hooks/use-tags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"

export function TagSelector({
  boardId,
  cardId,
}: {
  boardId: string
  cardId: string
}) {
  const { data: tags } = useTags(boardId)
  const { data: selectedTagIds } = useCardTags(cardId)
  const toggleTag = useToggleCardTag()
  const createTag = useCreateTag()
  const [newTagName, setNewTagName] = useState("")

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return
    const tag = await createTag.mutateAsync({
      board_id: boardId,
      name: newTagName.trim(),
      color: "#6366f1",
    })
    await toggleTag.mutateAsync({ card_id: cardId, tag_id: tag.id, add: true })
    setNewTagName("")
  }

  return (
    <div className="grid gap-2">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-1">
        {tags?.map((tag) => {
          const selected = selectedTagIds?.includes(tag.id) ?? false
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() =>
                toggleTag.mutate({
                  card_id: cardId,
                  tag_id: tag.id,
                  add: !selected,
                })
              }
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-all ${
                selected ? "ring-2 ring-offset-1" : "opacity-50 hover:opacity-80"
              }`}
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                border: `1px solid ${tag.color}40`,
              }}
            >
              {tag.name}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New tag name..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="h-7 text-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleCreateTag}
          disabled={!newTagName.trim() || createTag.isPending}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}

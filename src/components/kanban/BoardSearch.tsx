"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTags } from "@/hooks/use-tags"
import { useCurrentUser } from "@/hooks/use-assignees"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function BoardSearch({ boardId }: { boardId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: tags } = useTags(boardId)
  const { data: currentUser } = useCurrentUser()

  const q = searchParams.get("q") ?? ""
  const tagFilter = searchParams.get("tag") ?? ""
  const assigneeFilter = searchParams.get("assignee") ?? ""
  const dueFilter = searchParams.get("due") ?? ""

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const hasFilters = q || tagFilter || assigneeFilter || dueFilter

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cards..."
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
          className="h-8 w-48 pl-8 text-xs"
        />
      </div>

      {tags && tags.length > 0 && (
        <Select value={tagFilter} onValueChange={(v) => setParam("tag", v === " " ? "" : (v ?? ""))}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="All tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={dueFilter} onValueChange={(v) => setParam("due", v === " " ? "" : (v ?? ""))}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Due date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">All dates</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="today">Due today</SelectItem>
          <SelectItem value="week">This week</SelectItem>
          <SelectItem value="none">No due date</SelectItem>
        </SelectContent>
      </Select>

      {currentUser && (
        <Select
          value={assigneeFilter}
          onValueChange={(v) => setParam("assignee", v === " " ? "" : (v ?? ""))}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All</SelectItem>
            <SelectItem value={currentUser.id}>Assigned to me</SelectItem>
            <SelectItem value="none">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="xs" onClick={clearFilters}>
          <X className="mr-1 size-3" />
          Clear
        </Button>
      )}
    </div>
  )
}

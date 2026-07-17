import { KanbanBoard } from "@/components/kanban/KanbanBoard"

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = await params

  return <KanbanBoard boardId={boardId} />
}

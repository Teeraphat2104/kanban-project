export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = await params

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Board: {boardId}</h1>
    </div>
  )
}

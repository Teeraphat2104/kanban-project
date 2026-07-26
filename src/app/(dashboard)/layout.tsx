import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthButton } from "@/components/auth/AuthButton"
import { QueryProvider } from "@/components/providers/QueryProvider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <QueryProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/boards" className="font-semibold tracking-tight">
              Kanban Board
            </Link>
            <AuthButton email={user.email!} />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </QueryProvider>
  )
}

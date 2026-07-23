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
  
  // Debug: check cookies
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log("[DASHBOARD LAYOUT] Cookies:", JSON.stringify(allCookies.map(c => c.name)))
  
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log("[DASHBOARD LAYOUT] getUser error:", error?.message)
  console.log("[DASHBOARD LAYOUT] user:", user ? user.email : "NULL")

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

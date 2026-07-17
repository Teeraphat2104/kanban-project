"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AuthButton({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">{email}</span>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}

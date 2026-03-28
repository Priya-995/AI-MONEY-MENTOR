"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { TopNavbar } from "@/components/dashboard/top-navbar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {  // ← THIS OPENING BRACE WAS MISSING
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0b0d]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070809]">
      <DashboardSidebar />
      <div className="pl-64">
        <TopNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} // ← closing brace
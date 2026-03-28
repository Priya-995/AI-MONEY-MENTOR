"use client"

import { Bell, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNavbar() {
  const { user, logout } = useAuth()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  // Get initials from name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const firstName = user?.name?.split(" ")[0] ?? "there"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0b0d]/80 px-6 backdrop-blur-xl">
      <div>
        <h1 className="text-lg font-medium text-white">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-500">Let&apos;s check your financial health today</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Bell */}
        <button className="relative rounded-xl bg-white/5 p-2.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
        </button>

        {/* Avatar with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-medium text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border-white/10 bg-[#111318] text-white"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
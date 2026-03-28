"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Calendar,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat Advisor", href: "/dashboard/chat" },
  { icon: TrendingUp, label: "Investment Planner", href: "/dashboard/investments" },
  { icon: Calendar, label: "90-Day Plan", href: "/dashboard/plan" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Get initials
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0a0b0d]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
          <TrendingUp className="h-5 w-5 text-black" />
        </div>
        <span className="text-lg font-semibold text-white">AI Money Mentor</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-white"
              )} />
              {item.label}
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-white/10 p-4 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-black">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? "Guest"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email ?? ""}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
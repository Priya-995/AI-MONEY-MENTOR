"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2, TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const ok = await login(email, password)
        if (ok) router.push("/dashboard")
        else setError("Invalid email or password")
      } else {
        if (!name.trim()) { setError("Name is required"); return }
        const ok = await signup(name, email, password)
        if (ok) router.push("/dashboard")
        else setError("Email already registered")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0b0d] px-4">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400">
            <TrendingUp className="h-7 w-7 text-black" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">AI Money Mentor</h1>
            <p className="text-sm text-gray-500">Your personal financial advisor</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-8">
          {/* Toggle */}
          <div className="mb-6 flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => { setIsLogin(true); setError("") }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError("") }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@email.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-semibold text-black transition-all hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Logging in..." : "Creating account..."}
                </span>
              ) : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-center text-xs text-gray-500">
            💡 Demo: Sign up with any email & password to get started
          </div>
        </div>
      </div>
    </div>
  )
}
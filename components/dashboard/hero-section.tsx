"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useFinancial } from "@/lib/financial-context"


export function DashboardHero() {
  const { financialData, isAnalyzing, setScoreData, setPlanData, setIsAnalyzing } = useFinancial()
  const { user } = useAuth()

  // Get first name only
  const firstName = user?.name?.split(" ")[0] ?? "there"

  // Get time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const handleStartAnalysis = async () => {
    if (!financialData.income) {
      // Scroll to chat smoothly
      document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    setIsAnalyzing(true)
    try {
      // Run analyze
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialData }),
      })
      const analyzeJson = await analyzeRes.json()
      if (analyzeJson.score) setScoreData(analyzeJson.score)

      // Run plan
      const planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialData, score: analyzeJson.score }),
      })
      const planJson = await planRes.json()
      if (planJson.plan) setPlanData(planJson.plan)

    } catch (err) {
      console.error("Analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111318] via-[#0f1012] to-[#0a0b0d] p-8">
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          {/* Dynamic greeting */}
          <p className="mb-2 text-gray-400">
            {greeting}, {firstName} 👋
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Your Financial Health,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="mt-3 text-gray-400">
            {financialData.income
              ? `Tracking ₹${financialData.income.toLocaleString("en-IN")}/month · ${financialData.goals?.length ?? 0} goals set`
              : "Track, plan, and grow your money with AI guidance."}
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-medium hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              {financialData.income ? "Refresh Analysis" : "Start AI Analysis"}
            </>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
        </Button>
      </div>
    </div>
  )
}
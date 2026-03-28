"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useFinancial } from "@/lib/financial-context"
import { Loader2 } from "lucide-react"

export function HealthScoreCard() {
  const { scoreData, isAnalyzing } = useFinancial()
  const score = scoreData?.totalScore ?? 0
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getScoreColor = () => {
    if (score >= 80) return { from: "#22c55e", to: "#10b981" }
    if (score >= 60) return { from: "#eab308", to: "#22c55e" }
    return { from: "#ef4444", to: "#eab308" }
  }

  const colors = getScoreColor()

  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-8">
      <div
        className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${colors.from}, transparent)` }}
      />

      <div className="relative flex flex-col items-center">
        <h3 className="mb-6 text-lg font-medium text-gray-400">Your Money Health Score</h3>

        {isAnalyzing ? (
          <div className="flex h-52 w-52 flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-sm text-gray-400">Analyzing your finances...</p>
          </div>
        ) : (
          <div className="relative h-52 w-52">
            <svg className="h-full w-full -rotate-90 transform">
              <circle cx="104" cy="104" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
              <circle
                cx="104" cy="104" r="90"
                stroke="url(#scoreGradient)"
                strokeWidth="12" fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 12px ${colors.from})` }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.from} />
                  <stop offset="100%" stopColor={colors.to} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{animatedScore}</span>
              <span className="text-lg text-gray-500">/100</span>
              {scoreData && (
                <span className="mt-1 text-sm font-medium" style={{ color: colors.from }}>
                  {scoreData.label}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Score breakdown */}
        {scoreData && !isAnalyzing && (
          <div className="mt-6 w-full space-y-2">
            {Object.values(scoreData.breakdown).map((item: any) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-emerald-400">{item.score}/{item.maxScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!scoreData && !isAnalyzing && (
          <p className="mt-6 text-center text-sm text-gray-500">
            💬 Chat with Artha to calculate your score
          </p>
        )}
      </div>
    </Card>
  )
}
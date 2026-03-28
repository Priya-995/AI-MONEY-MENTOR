"use client"

import { Card } from "@/components/ui/card"
import { useFinancial } from "@/lib/financial-context"
import { Loader2, CheckCircle, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ActionPlanCard() {
  const { planData, isAnalyzing } = useFinancial()

  if (isAnalyzing) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <p className="text-sm text-gray-400">Generating your 90-day plan...</p>
        </div>
      </Card>
    )
  }

  if (!planData) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
        <h3 className="mb-4 text-lg font-medium text-white">Your 90-Day Financial Plan</h3>
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-sm text-gray-500">💬 Share your income & expenses with Artha to get your personalized plan</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Your 90-Day Financial Plan</h3>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
          AI Generated ✨
        </span>
      </div>

      {/* Summary */}
      <p className="mb-6 text-sm text-gray-400">{planData.summary}</p>

      {/* Months */}
      <div className="space-y-4">
        {planData.months?.map((month: any, idx: number) => (
          <div key={idx} className="rounded-xl bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                {month.month}
              </span>
              <h4 className="font-medium text-white">{month.title}</h4>
            </div>

            <div className="space-y-2">
              {month.weeks?.map((week: any, wIdx: number) => (
                <div key={wIdx} className="flex items-start gap-2 text-sm">
                  <span className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]",
                    week.category === "savings" && "bg-emerald-500/20 text-emerald-400",
                    week.category === "investment" && "bg-cyan-500/20 text-cyan-400",
                    week.category === "emergency" && "bg-orange-500/20 text-orange-400",
                    week.category === "expense" && "bg-red-500/20 text-red-400",
                  )}>
                    W{week.week}
                  </span>
                  <span className="text-gray-300">{week.action}</span>
                  {week.amount > 0 && (
                    <span className="ml-auto shrink-0 text-xs text-emerald-400">
                      ₹{week.amount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              🎯 {month.milestone}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {planData.recommendations?.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-400">Key Recommendations</h4>
          <div className="space-y-2">
            {planData.recommendations.map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-400">→</span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

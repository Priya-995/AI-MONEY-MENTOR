"use client"

import { ActionPlanCard } from "@/components/dashboard/action-plan-card"
import { HealthScoreCard } from "@/components/dashboard/health-score-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Target, Trophy, ArrowRight, Check, Clock, Loader2 } from "lucide-react"
import { useFinancial } from "@/lib/financial-context"

export default function PlanPage() {
  const { planData, scoreData, isAnalyzing, financialData } = useFinancial()

  // Dynamic milestones from AI plan or fallback
  const milestones = planData
    ? planData.months.map((month: any, i: number) => ({
        day: (i + 1) * 30,
        title: month.milestone,
        status: i === 0 ? "completed" : i === 1 ? "current" : "upcoming",
      }))
    : [
        { day: 30, title: "Chat with Artha to get your plan", status: "current" },
        { day: 60, title: "Financial goals will appear here", status: "upcoming" },
        { day: 90, title: "Your 90-day milestone", status: "upcoming" },
      ]

  const completedGoals = milestones.filter((m: any) => m.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">90-Day Financial Plan</h1>
          <p className="mt-1 text-gray-500">
            {planData
              ? planData.summary
              : "Chat with Artha to generate your personalized plan"}
          </p>
        </div>
        {planData && (
          <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400">
            ✨ AI Generated
          </div>
        )}
      </div>

      {/* Loading state */}
      {isAnalyzing && (
        <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-gray-400">Generating your personalized 90-day plan...</p>
          </div>
        </Card>
      )}

      {/* Progress Overview */}
      {!isAnalyzing && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <Calendar className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-sm text-gray-500">Plan Duration</p>
            <p className="mt-1 text-3xl font-bold text-white">
              90 <span className="text-lg font-normal text-gray-500">days</span>
            </p>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
              <Target className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-sm text-gray-500">Goals Set</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {financialData.goals?.length ?? 0}{" "}
              <span className="text-lg font-normal text-gray-500">goals</span>
            </p>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <Trophy className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-500">Health Score</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {scoreData?.totalScore ?? 0}
              <span className="text-lg font-normal text-gray-500">/100</span>
            </p>
          </Card>
        </div>
      )}

      {/* Timeline + Action Plan */}
      {!isAnalyzing && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Timeline */}
          <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
            <h3 className="mb-6 text-lg font-medium text-white">Your Timeline</h3>
            <div className="relative space-y-6">
              <div className="absolute left-4 top-2 h-[calc(100%-16px)] w-0.5 bg-white/10" />
              {milestones.map((milestone: any, i: number) => (
                <div key={i} className="relative flex items-start gap-4 pl-12">
                  <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                    milestone.status === "completed"
                      ? "bg-emerald-500 text-black"
                      : milestone.status === "current"
                      ? "bg-gradient-to-br from-emerald-400 to-cyan-400 text-black"
                      : "bg-white/10 text-gray-500"
                  }`}>
                    {milestone.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : milestone.status === "current" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{milestone.day}</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      milestone.status === "completed" ? "text-emerald-400" :
                      milestone.status === "current" ? "text-white" : "text-gray-500"
                    }`}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-500">Day {milestone.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Score + Plan */}
          <div className="space-y-6">
            <HealthScoreCard />
          </div>
        </div>
      )}

      {/* Full Action Plan */}
      {!isAnalyzing && (
        <ActionPlanCard />
      )}

      {/* Recommendations */}
      {planData?.recommendations && !isAnalyzing && (
        <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6">
          <h3 className="mb-4 text-lg font-medium text-white">
            💡 Key Recommendations
          </h3>
          <div className="space-y-3">
            {planData.recommendations.map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                  {i + 1}
                </span>
                {rec}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!planData && !isAnalyzing && (
        <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
              <Target className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">No Plan Yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Chat with Artha and share your income & goals to generate your personalized 90-day plan
              </p>
            </div>
            <Button
              onClick={() => window.location.href = "/dashboard/chat"}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:from-emerald-400 hover:to-cyan-400"
            >
              Chat with Artha
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
"use client"

import { Card } from "@/components/ui/card"
import { Wallet, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinancial } from "@/lib/financial-context"

export function QuickInsights() {
  const { financialData, scoreData } = useFinancial()

  // 📊 Derive real values from financial data
  const totalExpenses = financialData.expenses
    ? Object.values(financialData.expenses).reduce((a, b) => a + b, 0)
    : null

  const topExpenseEntry = financialData.expenses
    ? Object.entries(financialData.expenses).sort(([, a], [, b]) => b - a)[0]
    : null

  const topExpenseLabel: Record<string, string> = {
    rent: "Rent", food: "Food & Dining",
    transport: "Transport", emis: "EMIs", other: "Other",
  }

  const insights = [
    {
      id: 1,
      icon: Wallet,
      label: "Monthly Savings",
      value: financialData.savings
        ? `₹${financialData.savings.toLocaleString("en-IN")}`
        : "—",
      subValue: financialData.income
        ? `${((financialData.savings! / financialData.income) * 100).toFixed(0)}% of income`
        : null,
      change: scoreData ? `Score: ${scoreData.totalScore}` : "Chat to analyze",
      trend: "up" as const,
      color: "emerald",
    },
    {
      id: 2,
      icon: ShoppingBag,
      label: "Top Expense Category",
      value: topExpenseEntry
        ? topExpenseLabel[topExpenseEntry[0]] || topExpenseEntry[0]
        : "—",
      subValue: topExpenseEntry
        ? `₹${topExpenseEntry[1].toLocaleString("en-IN")}`
        : null,
      change: totalExpenses && financialData.income
        ? `${((totalExpenses / financialData.income) * 100).toFixed(0)}% of income`
        : "No data yet",
      trend: "down" as const,
      color: "orange",
    },
    {
      id: 3,
      icon: TrendingUp,
      label: "Monthly Surplus",
      value: financialData.income && totalExpenses
        ? (() => {
            const surplus = financialData.income - totalExpenses - (financialData.savings ?? 0)
            if (surplus >= 100000) return `₹${(surplus / 100000).toFixed(1)}L`
            return `₹${surplus.toLocaleString("en-IN")}`
          })()
        : "—",
      subValue: financialData.income
        ? `Income: ₹${financialData.income.toLocaleString("en-IN")}`
        : null,
      change: financialData.goals?.length
        ? `${financialData.goals.length} goals set`
        : "No goals yet",
      trend: "up" as const,
      color: "cyan",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight) => (
        <Card
          key={insight.id}
          className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-5 transition-all duration-300 hover:border-white/20"
        >
          <div className={cn(
            "absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20",
            insight.color === "emerald" && "bg-emerald-500",
            insight.color === "orange" && "bg-orange-500",
            insight.color === "cyan" && "bg-cyan-500"
          )} />

          <div className="relative flex items-start justify-between">
            <div className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              insight.color === "emerald" && "bg-emerald-500/20",
              insight.color === "orange" && "bg-orange-500/20",
              insight.color === "cyan" && "bg-cyan-500/20"
            )}>
              <insight.icon className={cn(
                "h-5 w-5",
                insight.color === "emerald" && "text-emerald-400",
                insight.color === "orange" && "text-orange-400",
                insight.color === "cyan" && "text-cyan-400"
              )} />
            </div>

            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              insight.trend === "up"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-orange-500/20 text-orange-400"
            )}>
              {insight.trend === "up"
                ? <ArrowUpRight className="h-3 w-3" />
                : <ArrowDownRight className="h-3 w-3" />}
              {insight.change}
            </div>
          </div>

          <div className="relative mt-4">
            <p className="text-sm text-gray-500">{insight.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{insight.value}</p>
            {insight.subValue && (
              <p className="mt-0.5 text-sm text-gray-500">{insight.subValue}</p>
            )}
            {insight.value === "—" && (
              <p className="mt-1 text-xs text-gray-600">
                💬 Chat with Artha to see real data
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
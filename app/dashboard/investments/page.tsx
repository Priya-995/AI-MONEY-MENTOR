"use client"

import { InvestmentSimulator } from "@/components/dashboard/investment-simulator"
import { Card } from "@/components/ui/card"
import { TrendingUp, Wallet, PieChart, ArrowUpRight } from "lucide-react"
import { useFinancial } from "@/lib/financial-context"
import { INVESTMENT_PRESETS, simulateInvestment } from "@/lib/simulator"
import { useState } from "react"

const portfolioItems = [
  { name: "Nifty 50 Index Fund", amount: "₹1,20,000", returns: "+18.5%", color: "emerald" },
  { name: "HDFC Mid-Cap Fund", amount: "₹80,000", returns: "+22.3%", color: "cyan" },
  { name: "SBI Small Cap Fund", amount: "₹40,000", returns: "+15.8%", color: "purple" },
]

export default function InvestmentsPage() {
  const { financialData } = useFinancial()
  const [selectedPreset, setSelectedPreset] = useState("sip")

  // Calculate suggested monthly investment (20% of income)
  const suggestedSIP = financialData.income
    ? Math.round(financialData.income * 0.2)
    : 10000

  // Run simulation for 10 years
  const simulation = simulateInvestment({
    monthlyAmount: suggestedSIP,
    annualReturn: INVESTMENT_PRESETS[selectedPreset as keyof typeof INVESTMENT_PRESETS].annualReturn,
    years: 10,
  })

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Investment Planner</h1>
        <p className="mt-1 text-gray-500">Plan and track your investment journey</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Wallet,
            label: "Suggested SIP",
            value: formatCurrency(suggestedSIP) + "/mo",
            color: "emerald",
            sub: "20% of income",
          },
          {
            icon: TrendingUp,
            label: "10-Year Value",
            value: formatCurrency(simulation.summary.finalValue),
            color: "cyan",
            sub: `At ${INVESTMENT_PRESETS[selectedPreset as keyof typeof INVESTMENT_PRESETS].annualReturn}% returns`,
          },
          {
            icon: PieChart,
            label: "Total Gains",
            value: formatCurrency(simulation.summary.totalGains),
            color: "purple",
            sub: "Expected profit",
          },
          {
            icon: ArrowUpRight,
            label: "Return Multiple",
            value: `${simulation.summary.returnMultiple}x`,
            color: "orange",
            sub: "Your money grows",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-5"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-${item.color}-500/20`}>
              <item.icon className={`h-5 w-5 text-${item.color}-400`} />
            </div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-0.5 text-xs text-gray-600">{item.sub}</p>
          </Card>
        ))}
      </div>

      {/* Investment Type Selector */}
      <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Compare Investment Options
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(INVESTMENT_PRESETS).map(([key, preset]) => {
            const sim = simulateInvestment({
              monthlyAmount: suggestedSIP,
              annualReturn: preset.annualReturn,
              years: 10,
            })
            return (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedPreset === key
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{preset.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    preset.risk === "None" || preset.risk === "Low"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : preset.risk === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {preset.risk}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {preset.annualReturn}% returns/year
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-400">
                  {formatCurrency(sim.summary.finalValue)}
                </p>
                <p className="text-xs text-gray-600">in 10 years</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Portfolio */}
      <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Sample Portfolio
          <span className="ml-2 text-xs text-gray-500">(example allocation)</span>
        </h3>
        <div className="space-y-3">
          {portfolioItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full bg-${item.color}-500`} />
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-gray-500">Mutual Fund · SIP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">{item.amount}</p>
                <p className="text-sm text-emerald-400">{item.returns}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Full Simulator */}
      <InvestmentSimulator />
    </div>
  )
}
"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

export function InvestmentSimulator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [duration, setDuration] = useState("5")

  const chartData = useMemo(() => {
    const years = parseInt(duration)
    const annualRate = 0.12 // 12% annual return
    const data = []

    for (let year = 0; year <= years; year++) {
      const months = year * 12
      const futureValue = monthlyInvestment * ((Math.pow(1 + annualRate / 12, months) - 1) / (annualRate / 12)) * (1 + annualRate / 12)
      const invested = monthlyInvestment * months
      
      data.push({
        year: `Year ${year}`,
        value: Math.round(futureValue),
        invested: invested,
      })
    }

    return data
  }, [monthlyInvestment, duration])

  const projectedValue = chartData[chartData.length - 1]?.value || 0
  const totalInvested = chartData[chartData.length - 1]?.invested || 0
  const returns = projectedValue - totalInvested

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d] p-6">
      <h3 className="mb-6 text-lg font-medium text-white">Investment Growth Simulator</h3>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Monthly Investment Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Monthly Investment</label>
            <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
              ₹{monthlyInvestment.toLocaleString("en-IN")}
            </span>
          </div>
          <Slider
            value={[monthlyInvestment]}
            onValueChange={(value) => setMonthlyInvestment(value[0])}
            min={1000}
            max={50000}
            step={1000}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-400 [&_[role=slider]]:to-cyan-400 [&_[role=slider]]:border-0 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-emerald-500 [&_.bg-primary]:to-cyan-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹1,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* Duration Select */}
        <div className="space-y-4">
          <label className="text-sm text-gray-400">Investment Duration</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1a1b1e]">
              {[1, 2, 3, 5, 7, 10].map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  className="text-gray-300 focus:bg-white/10 focus:text-white"
                >
                  {year} {year === 1 ? "Year" : "Years"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1a1b1e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [formatCurrency(value), 'Projected Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-gray-500">Total Invested</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-4">
          <p className="text-xs text-emerald-400">Projected Value</p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">{formatCurrency(projectedValue)}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-gray-500">Expected Returns</p>
          <p className="mt-1 text-lg font-semibold text-cyan-400">+{formatCurrency(returns)}</p>
        </div>
      </div>
    </Card>
  )
}

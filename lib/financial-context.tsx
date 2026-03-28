// /lib/financial-context.tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FinancialData {
  income?: number
  expenses?: {
    rent?: number
    food?: number
    transport?: number
    emis?: number
    other?: number
  }
  savings?: number
  goals?: string[]
  extracted?: boolean
}

interface ScoreData {
  totalScore: number
  grade: string
  label: string
  color: string
  breakdown: Record<string, any>
  insights: Record<string, any>
}

interface PlanData {
  summary: string
  months: any[]
  recommendations: string[]
  projectedSavings: number
}

interface FinancialContextType {
  financialData: FinancialData
  setFinancialData: (data: FinancialData) => void
  scoreData: ScoreData | null
  setScoreData: (score: ScoreData) => void
  planData: PlanData | null
  setPlanData: (plan: PlanData) => void
  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void
}

const FinancialContext = createContext<FinancialContextType | null>(null)

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [financialData, setFinancialData] = useState<FinancialData>({})
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <FinancialContext.Provider value={{
      financialData, setFinancialData,
      scoreData, setScoreData,
      planData, setPlanData,
      isAnalyzing, setIsAnalyzing,
    }}>
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const ctx = useContext(FinancialContext)
  if (!ctx) throw new Error("useFinancial must be used inside FinancialProvider")
  return ctx
}
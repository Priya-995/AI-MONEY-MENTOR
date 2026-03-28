import { DashboardHero } from "@/components/dashboard/hero-section"
import { HealthScoreCard } from "@/components/dashboard/health-score-card"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { InvestmentSimulator } from "@/components/dashboard/investment-simulator"
import { ActionPlanCard } from "@/components/dashboard/action-plan-card"
import { QuickInsights } from "@/components/dashboard/quick-insights"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHero />
      <QuickInsights />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <HealthScoreCard />   {/* ← removed hardcoded score={72} */}
          <ActionPlanCard />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div id="chat-section" className="grid gap-6 xl:grid-cols-2"> {/* ← added id for scroll */}
            <ChatInterface />
            <InvestmentSimulator />
          </div>
        </div>
      </div>
    </div>
  )
}
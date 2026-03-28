"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinancial } from "@/lib/financial-context"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Namaste! 🙏 I'm Artha, your AI Money Mentor. Tell me about yourself — are you salaried, freelancer, or business owner? And roughly how much do you earn per month?",
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 🔗 Connect to global financial state
  const { financialData, setFinancialData, setScoreData, setPlanData, setIsAnalyzing } = useFinancial()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 📊 Auto-trigger analyze + plan when we have enough data
  const triggerAnalysis = async (newData: any) => {
    if (!newData?.income) return // need at least income

    setIsAnalyzing(true)
    try {
      // 1. Get health score
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialData: newData }),
      })
      const analyzeJson = await analyzeRes.json()
      if (analyzeJson.score) setScoreData(analyzeJson.score)

      // 2. Generate 90-day plan
      const planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialData: newData, score: analyzeJson.score }),
      })
      const planJson = await planRes.json()
      if (planJson.plan) setPlanData(planJson.plan)

    } catch (err) {
      console.error("Analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      // 🔗 Call real AI API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      // Add AI reply
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "assistant", content: data.message },
      ])

      // 💾 Merge extracted financial data
      if (data.extractedData) {
        const merged = { ...financialData, ...data.extractedData }
        setFinancialData(merged)

        // 🚀 Auto-analyze when we have income data
        if (data.extractedData.income || financialData.income) {
          await triggerAnalysis(merged)
        }
      }

    } catch (err) {
      console.error("Chat error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again! 🙏",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Card className="flex h-[500px] flex-col overflow-hidden border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
          <Bot className="h-5 w-5 text-black" />
        </div>
        <div>
          <h3 className="font-medium text-white">Artha — AI Advisor</h3>
          <p className="text-xs text-gray-500">Powered by Llama 3.3</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-xs text-emerald-400">Online</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-5" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                message.role === "user"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-emerald-400 to-cyan-400"
              )}>
                {message.role === "user"
                  ? <User className="h-4 w-4 text-white" />
                  : <Bot className="h-4 w-4 text-black" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                  : "bg-white/5 text-gray-300"
              )}>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400">
                <Bot className="h-4 w-4 text-black" />
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Artha about your finances..."
            className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500/50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isTyping}
            className="shrink-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:from-emerald-400 hover:to-cyan-400"
          >
            {isTyping
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, TrendingUp, PiggyBank, Calculator } from "lucide-react"
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
    content: "Namaste! 🙏 I'm Artha, your AI Money Mentor.\n\nI can help you with:\n• Understanding your spending patterns\n• Creating savings strategies\n• Investment recommendations (SIP, PPF, ELSS)\n• Budget planning\n• Financial goal setting\n\nWhat would you like to discuss today?",
  },
]

const suggestedQuestions = [
  { icon: TrendingUp, text: "How can I grow my wealth?" },
  { icon: PiggyBank, text: "Help me save more money" },
  { icon: Calculator, text: "I earn ₹60,000/month, help me plan" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { financialData, setFinancialData, setScoreData, setPlanData, setIsAnalyzing } = useFinancial()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const triggerAnalysis = async (newData: any) => {
    if (!newData?.income) return
    setIsAnalyzing(true)
    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ financialData: newData }),
      })
      const analyzeJson = await analyzeRes.json()
      if (analyzeJson.score) setScoreData(analyzeJson.score)

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

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isTyping) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: messageText,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      // 🔗 Call real Groq AI
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

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, role: "assistant", content: data.message },
      ])

      // 💾 Save extracted financial data + trigger analysis
      if (data.extractedData) {
        const merged = { ...financialData, ...data.extractedData }
        setFinancialData(merged)
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
    <div className="mx-auto max-w-4xl">
      <Card className="flex h-[calc(100vh-180px)] flex-col overflow-hidden border-white/10 bg-gradient-to-br from-[#111318] to-[#0a0b0d]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
            <Bot className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="font-medium text-white">Artha — AI Advisor</h3>
            <p className="text-xs text-gray-500">Powered by Llama 3.3 · Groq</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-4", message.role === "user" ? "flex-row-reverse" : "")}
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  message.role === "user"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-emerald-400 to-cyan-400"
                )}>
                  {message.role === "user"
                    ? <User className="h-4 w-4 text-white" />
                    : <Bot className="h-4 w-4 text-black" />}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
                    : "bg-white/5 text-gray-300"
                )}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                  <Bot className="h-4 w-4 text-black" />
                </div>
                <div className="rounded-2xl bg-white/5 px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions — show only at start */}
        {messages.length <= 1 && (
          <div className="border-t border-white/10 px-6 py-4">
            <p className="mb-3 text-xs text-gray-500">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.text)}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <q.icon className="h-4 w-4 text-emerald-400" />
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Artha anything about your finances..."
              className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500/50"
            />
            <Button
              type="submit"
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
    </div>
  )
}

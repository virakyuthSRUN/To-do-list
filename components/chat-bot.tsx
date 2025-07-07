"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/contexts/language-context"

interface Message {
  role: "user" | "assistant"
  content: string
  showContinue?: boolean
}

export function ChatBot() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("chat.greeting"),
      showContinue: true,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.greeting"),
          showContinue: true,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleContinue = (index: number) => {
    setMessages((prev) => {
      const newMessages = [...prev]
      newMessages[index] = { ...newMessages[index], showContinue: false }
      return newMessages
    })
    setInput(t("chat.greeting"))
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-[350px] h-[500px] shadow-lg flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-bold">{t("chat.title")}</h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div key={i}>
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                  {message.role === "assistant" && message.showContinue && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleContinue(i)}
                      >
                        {t("chat.continue")} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-muted">{t("chat.typing")}</div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              placeholder={t("chat.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {t("chat.send")}
            </Button>
          </form>
        </Card>
      )}
    </>
  )
}

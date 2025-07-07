"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-[350px] h-[500px] shadow-lg p-4">
          <iframe src="/chat" className="w-full h-full border-none" title="AI Chat" />
        </Card>
      )}
    </>
  )
}

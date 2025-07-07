"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DynamicSectionLayoutProps {
  inputContainer: ReactNode
  outputContainer?: ReactNode
  className?: string
  isSubmitted: boolean
}

export function DynamicSectionLayout({
  inputContainer,
  outputContainer,
  className,
  isSubmitted,
}: DynamicSectionLayoutProps) {
  return (
    <div
      className={cn(
        "grid transition-all duration-300",
        isSubmitted ? "grid-cols-1 md:grid-cols-2 gap-6" : "grid-cols-1",
        className,
      )}
    >
      <div
        className={cn(
          "transition-all duration-300",
          isSubmitted ? "justify-self-start w-full" : "justify-self-center w-full max-w-2xl",
        )}
      >
        {inputContainer}
      </div>
      {isSubmitted && outputContainer && (
        <div className="w-full animate-in slide-in-from-right-1/4 duration-300">{outputContainer}</div>
      )}
    </div>
  )
}

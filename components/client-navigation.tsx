"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function ClientNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  const navItems = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#about", label: t("nav.about") },
  ]

  return (
    <nav className="ml-auto flex items-center gap-4">
      <LanguageSwitcher />
      <div className="hidden md:flex items-center gap-6 sm:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={scrollToSection(item.href.slice(1))}
            className="text-base font-medium hover:text-primary hover:underline underline-offset-4"
          >
            {item.label}
          </Link>
        ))}
        <Button asChild>
          <Link href="#try-now" onClick={scrollToSection("try-now")}>
            {t("nav.tryNow")}
          </Link>
        </Button>
      </div>
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={scrollToSection(item.href.slice(1))}
              className="block px-4 py-2 text-base font-medium hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <div className="px-4 py-2">
            <Button asChild className="w-full">
              <Link href="#try-now" onClick={scrollToSection("try-now")}>
                {t("nav.tryNow")}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

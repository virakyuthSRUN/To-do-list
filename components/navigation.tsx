"use client"

import Link from "next/link"

export function Navigation() {
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="ml-auto flex gap-6 sm:gap-8">
      {["features", "how-it-works", "try-now", "about"].map((section) => (
        <Link
          key={section}
          href={`#${section}`}
          onClick={scrollToSection(section)}
          className="text-base font-medium hover:text-primary hover:underline underline-offset-4"
        >
          {section === "features" && "មុខងារ"}
          {section === "how-it-works" && "របៀបប្រើប្រាស់"}
          {section === "try-now" && "សាកល្បង"}
          {section === "about" && "អំពីយើង"}
        </Link>
      ))}
    </nav>
  )
}

"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (checked: boolean) => {
    setLanguage(checked ? "en" : "km")
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch" className="text-sm font-medium">
        ខ្មែរ
      </Label>
      <Switch
        id="language-switch"
        checked={language === "en"}
        onCheckedChange={handleLanguageChange}
        className="data-[state=checked]:bg-blue-600"
      />
      <Label htmlFor="language-switch" className="text-sm font-medium">
        EN
      </Label>
    </div>
  )
}

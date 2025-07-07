import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FunctionCardProps {
  icon: keyof typeof Icons
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonIcon: keyof typeof Icons
  buttonHref: string
}

export function FunctionCard({
  icon: Icon,
  title,
  description,
  imageUrl,
  buttonText,
  buttonIcon,
  buttonHref,
}: FunctionCardProps) {
  const IconComponent = Icons[Icon]
  const ButtonIconComponent = Icons[buttonIcon]

  return (
    <div className="flex flex-col items-center space-y-4 p-6 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
      <IconComponent className="h-12 w-12 text-primary mb-2" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{description}</p>
      <div className="relative w-full aspect-video mt-4 rounded-lg overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <Button variant="outline" asChild className="mt-4">
        <a href={buttonHref} className="flex items-center space-x-2">
          <ButtonIconComponent className="h-4 w-4" />
          <span>{buttonText}</span>
        </a>
      </Button>
    </div>
  )
}

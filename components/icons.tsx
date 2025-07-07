import {
  TypeIcon as type,
  type LightbulbIcon as LucideProps,
  FileText,
  Upload,
  Brain,
  Activity,
  Stethoscope,
  User,
  MessageCircle,
  ArrowRight,
  Handshake,
  Heart,
  Lightbulb,
  Shield,
} from "lucide-react"

export const Icons = {
  medical: (props: LucideProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
      <path d="M5 7h14" />
      <path d="M17 13v-3" />
      <path d="M12 20l4-7h4.5L22 20" />
      <path d="M18 18h4" />
    </svg>
  ),
  fileText: FileText,
  upload: Upload,
  brain: Brain,
  activity: Activity,
  stethoscope: Stethoscope,
  user: User,
  messageCircle: MessageCircle,
  arrowRight: ArrowRight,
  collaboration: Handshake,
  health: Heart,
  innovation: Lightbulb,
  privacy: Shield,
}

export type Icon = keyof typeof Icons

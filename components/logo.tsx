import Link from "next/link"
import { GlassWaterIcon as WaterIcon } from "lucide-react"

export function Logo({ size = "default" }: { size?: "default" | "large" | "small" }) {
  const sizeClasses = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-4xl",
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="rounded-full bg-gradient-to-r from-lugasa-600 to-lugasa-400 p-1.5">
        <WaterIcon className="h-5 w-5 text-white" />
      </div>
      <span className={`font-bold ${sizeClasses[size]} gradient-text`}>Lugasa</span>
    </Link>
  )
}

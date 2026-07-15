import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function confidenceVariant(level: "high" | "medium" | "low") {
  return level === "high" ? "default" : level === "medium" ? "secondary" : "outline"
}

type HasNames = { name: string; nameZh: string }

export function localizedName(entity: HasNames, locale: string) {
  const isZh = locale === "zh"
  return {
    primary: isZh ? entity.nameZh : entity.name,
    secondary: isZh ? entity.name : entity.nameZh,
  }
}

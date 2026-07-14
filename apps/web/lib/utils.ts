import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function confidenceVariant(level: "high" | "medium" | "low") {
  return level === "high" ? "default" : level === "medium" ? "secondary" : "outline"
}

import type { Metadata } from "next"
import { Outfit, Geist } from "next/font/google"
import { cn } from "@summoner-atlas/ui"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Summoner Atlas — Patch Data Decision Desk",
  description:
    "Make every choice evidence-based. High-sample, explainable champion and augment conclusions for the current patch.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  )
}

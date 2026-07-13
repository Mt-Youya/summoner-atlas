import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://summoner-atlas.yonjay.me"),
  title: "summoner-atlas — 海克斯大乱斗版本决策台",
  description: "快速查询英雄与海克斯数据，在开局前做出更可靠的版本选择。",
  openGraph: {
    title: "summoner-atlas — 海克斯大乱斗版本决策台",
    description: "快速查询英雄与海克斯数据，在开局前做出更可靠的版本选择。",
    type: "website",
    locale: "zh_CN",
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

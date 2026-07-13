import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import { LocaleProvider } from "@/components/locale-provider"
import { isLocale } from "@summoner-atlas/i18n"
import { siteUrl } from "@/lib/site"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Summoner Atlas｜大乱斗版本决策", template: "%s｜Summoner Atlas" },
  description: "基于全球公开样本的大乱斗英雄、海克斯与组合数据。",
  openGraph: {
    title: "Summoner Atlas｜大乱斗版本决策",
    description: "基于全球公开样本的大乱斗英雄、海克斯与组合数据。",
    type: "website",
    locale: "zh_CN",
  },
  twitter: { card: "summary_large_image" },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestLocale = (await headers()).get("x-summoner-atlas-locale")
  const locale = isLocale(requestLocale) ? requestLocale : "zh"
  return (
    <html lang={locale === "ko" ? "ko" : locale === "en" ? "en" : "zh-CN"} data-scroll-behavior="smooth">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}

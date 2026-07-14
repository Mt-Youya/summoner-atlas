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

export async function generateMetadata(): Promise<Metadata> {
  const requestLocale = (await headers()).get("x-summoner-atlas-locale")
  const locale = isLocale(requestLocale) ? requestLocale : "zh"
  const title =
    locale === "en"
      ? "Summoner Atlas | ARAM Data Decisions"
      : locale === "ko"
        ? "Summoner Atlas | 칼바람 데이터 의사결정"
        : "Summoner Atlas | 大乱斗版本决策"
  const description =
    locale === "en"
      ? "Global ARAM champion, augment, and combo data based on public match samples."
      : locale === "ko"
        ? "공개 매치 샘플 기반 칼바람 챔피언, 증강, 조합 데이터."
        : "基于全球公开样本的大乱斗英雄、海克斯与组合数据。"
  return {
    metadataBase: siteUrl,
    title: { default: title, template: "%s | Summoner Atlas" },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "en" ? "en_US" : "zh_CN",
    },
    twitter: { card: "summary_large_image" },
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestLocale = (await headers()).get("x-summoner-atlas-locale")
  const locale = isLocale(requestLocale) ? requestLocale : "zh"
  return (
    <html
      lang={locale === "ko" ? "ko" : locale === "en" ? "en" : "zh-CN"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-xl focus:bg-primary focus:px-5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}

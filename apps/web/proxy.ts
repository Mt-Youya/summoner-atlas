import { NextResponse, type NextRequest } from "next/server"
import { isLocale } from "@summoner-atlas/i18n"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = pathname.match(/^\/(zh|en|ko)(?:\/|$)/)
  if (!match || match[1] === "zh") return NextResponse.next()

  const locale = match[1]
  if (!isLocale(locale)) return NextResponse.next()
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = pathname.replace(/^\/(en|ko)(?=\/|$)/, "/zh")
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-summoner-atlas-locale", locale)
  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
}

export const config = { matcher: ["/en/:path*", "/ko/:path*"] }

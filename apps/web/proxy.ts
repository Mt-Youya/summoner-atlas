import { NextResponse, type NextRequest } from "next/server"
import { isLocale } from "@summoner-atlas/i18n"

const COOKIE_NAME = "summoner-atlas-locale"
const DEFAULT_LOCALE = "zh"

function getUserLocale(request: NextRequest): string {
  const cookie = request.cookies.get(COOKIE_NAME)?.value
  if (cookie && isLocale(cookie)) return cookie
  const acceptLanguage = request.headers.get("accept-language") ?? ""
  const first = acceptLanguage.split(",")[0]?.trim().slice(0, 2).toLowerCase()
  if (first === "en") return "en"
  if (first === "ko") return "ko"
  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/") {
    const locale = getUserLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    const response = NextResponse.redirect(url)
    response.cookies.set(COOKIE_NAME, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  const match = pathname.match(/^\/(zh|en|ko)(?:\/|$)/)
  if (!match || !isLocale(match[1])) return NextResponse.next()

  const locale = match[1]
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-summoner-atlas-locale", locale)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.cookies.set(COOKIE_NAME, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = { matcher: ["/", "/zh/:path*", "/en/:path*", "/ko/:path*"] }

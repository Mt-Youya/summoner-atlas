import { NextRequest, NextResponse } from "next/server"

const supportedLocales = ["zh", "en", "ko"]
const defaultLocale = "zh"

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname
  const pathLocale = pathname.split("/")[1]
  if (supportedLocales.includes(pathLocale)) return pathLocale
  const cookie = request.cookies.get("summoner-atlas-locale")?.value
  if (cookie && supportedLocales.includes(cookie)) return cookie
  const acceptLang = request.headers.get("accept-language") ?? ""
  for (const locale of supportedLocales) {
    if (acceptLang.includes(locale)) return locale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }
  const pathLocale = pathname.split("/")[1]
  if (supportedLocales.includes(pathLocale)) {
    const response = NextResponse.next()
    response.headers.set("x-summoner-atlas-locale", pathLocale)
    return response
  }
  const locale = getLocale(request)
  const newPath = `/${locale}${pathname === "/" ? "" : pathname}`
  const response = NextResponse.redirect(new URL(newPath, request.url))
  response.cookies.set("summoner-atlas-locale", locale)
  return response
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}

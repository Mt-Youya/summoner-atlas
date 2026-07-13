import { cookies } from "next/headers"
import { permanentRedirect } from "next/navigation"
import { isLocale } from "@summoner-atlas/i18n"

export default async function LegacyAugment({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookie = (await cookies()).get("summoner-atlas-locale")?.value
  const locale = isLocale(cookie) ? cookie : "zh"
  permanentRedirect(`/${locale}/augments/${id}`)
}

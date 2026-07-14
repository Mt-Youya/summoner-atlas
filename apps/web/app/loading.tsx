import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export default async function Loading() {
  const locale = await getLocale()
  return (
    <main className="relative z-10 mx-auto grid min-h-[70vh] w-[min(100%-2rem,40rem)] content-center gap-6">
      <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
        {t(locale, "pageLoading")}
      </span>
      <h1 className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {t(locale, "preparingPatch")}
      </h1>
      <p className="max-w-[48ch] text-base leading-7 text-muted-foreground">
        {t(locale, "readingSnapshot")}
      </p>
      <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-1/2 animate-[indeterminate_1.5s_ease-in-out_infinite] rounded-full bg-primary/40" />
      </div>
    </main>
  )
}

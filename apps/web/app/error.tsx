"use client"

import { useTranslation } from "@/components/locale-provider"

export default function Error({ reset }: { reset: () => void }) {
  const translate = useTranslation()
  return (
    <main className="relative z-10 mx-auto grid min-h-[70vh] w-[min(100%-2rem,40rem)] content-center gap-6">
      <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
        {translate("dataUnavailable")}
      </span>
      <h1 className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {translate("cannotLoadPage")}
      </h1>
      <p className="max-w-[48ch] text-base leading-7 text-muted-foreground">
        {translate("checkNetworkRetry")}
      </p>
      <button
        className="inline-flex min-h-12 w-fit items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_-8px_var(--primary)] active:scale-[0.97]"
        type="button"
        onClick={reset}
      >
        {translate("reload")}
      </button>
    </main>
  )
}

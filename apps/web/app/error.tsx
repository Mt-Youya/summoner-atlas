"use client"

import { useTranslation } from "@/components/locale-provider"

export default function Error({ reset }: { reset: () => void }) {
  const translate = useTranslation()
  return (
    <main className="mx-auto grid min-h-[70vh] w-[min(100%-3rem,45rem)] content-center gap-5">
      <span className="font-mono text-[11px] tracking-widest text-primary">{translate("dataUnavailable")}</span>
      <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {translate("cannotLoadPage")}
      </h1>
      <p className="leading-8 text-muted-foreground">{translate("checkNetworkRetry")}</p>
      <button className="w-max border border-primary px-4 py-3 text-primary" type="button" onClick={reset}>
        {translate("reload")}
      </button>
    </main>
  )
}

"use client"

import { useTranslation } from "@/hooks/use-translation"

export default function SupportPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{t("supportCompliance")}</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{t("support")}</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground leading-7">{t("supportDesc")}</p>
    </div>
  )
}

import { getLocale } from "@/lib/i18n-server"
import { translateCopy } from "@summoner-atlas/i18n"

export async function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  const locale = await getLocale()
  return (
    <section className="border-b border-white/[0.06] pt-[clamp(5rem,10vw,9rem)] pb-12 md:pb-16">
      <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
        {translateCopy(locale, eyebrow)}
      </span>
      <h1 className="mt-4 max-w-2xl text-[clamp(2.75rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {translateCopy(locale, title)}
      </h1>
      {description && (
        <p className="mt-5 max-w-[58ch] text-base leading-7 text-muted-foreground">
          {translateCopy(locale, description)}
        </p>
      )}
    </section>
  )
}

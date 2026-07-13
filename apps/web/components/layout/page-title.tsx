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
    <section className="border-b border-border pt-[clamp(5.5rem,12vw,10.4rem)] pb-14">
      <span className="font-mono text-xs font-bold tracking-[.1em] text-primary">{translateCopy(locale, eyebrow)}</span>
      <h1 className="mt-3 max-w-[10ch] text-[clamp(3rem,7vw,6.25rem)] font-black leading-[.88] tracking-[-.1em]">
        {translateCopy(locale, title)}
      </h1>
      <p className="mt-5 max-w-[62ch] leading-8 text-muted-foreground">{translateCopy(locale, description)}</p>
    </section>
  )
}

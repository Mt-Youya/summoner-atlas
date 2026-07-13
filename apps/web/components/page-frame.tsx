import Link from "next/link"

const links = [
  ["英雄榜", "/zh/champions"],
  ["海克斯榜", "/zh/augments"],
  ["组合研究", "/zh/combinations"],
  ["数据方法", "/zh/methodology"],
] as const

export function PageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen w-full bg-[var(--award-paper)] px-4 text-[var(--award-ink)] sm:px-8 lg:mx-auto lg:max-w-[1320px] lg:px-12">
      <header className="grid min-h-[86px] grid-cols-[1fr_auto] items-center border-b border-black/20 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/zh" className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.08em]">
          <span className="grid size-6 place-items-center bg-[var(--award-ink)] text-[var(--award-paper)]">R</span>
          <span>summoner-atlas</span>
        </Link>
        <nav className="hidden items-center md:flex" aria-label="主导航">
          {links.map(([label, href]) => (
            <Link
              className="px-3 py-2 text-[11px] tracking-[0.03em] transition-colors hover:bg-[var(--award-lime)]"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="justify-self-end border border-black/30 px-3 py-2 text-xs transition-colors hover:bg-[var(--award-lime)]"
          href="/zh/profile"
        >
          我的
        </Link>
      </header>
      {children}
      <footer className="mt-5 flex min-h-[120px] flex-col justify-center gap-2 border-t border-black/20 py-8 text-[11px] text-black/60 sm:flex-row sm:items-center sm:justify-between">
        <span>数据版本 16.13 · 公开数据快照</span>
        <span>与 Riot Games 无关联。</span>
      </footer>
    </main>
  )
}

export function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b border-black/20 pt-[clamp(5.5rem,12vw,10.4rem)] pb-14">
      <span className="font-mono text-[11px] tracking-[0.1em] text-cyan-500">{eyebrow}</span>
      <h1 className="mt-3 max-w-[10ch] text-[clamp(3rem,7vw,6.25rem)] font-black leading-[0.88] tracking-[-0.1em]">
        {title}
      </h1>
      <p className="mt-5 max-w-[62ch] leading-8 text-black/65">{description}</p>
    </section>
  )
}

import Link from "next/link"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"

export const metadata: Metadata = { title: "登录 | Summoner Atlas" }

export default function LoginPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="账户" title="登录与绑定" description="授权服务待接入真实 OAuth 回调与会话 API。" />
      <section className="my-12 grid gap-6 md:grid-cols-2">
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="font-mono text-xs tracking-[.08em] text-primary uppercase">QQ 登录</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            用于国服玩家绑定与数据同步。接入 QQ 互联 OAuth 2.0 后启用。
          </p>
          <span className="mt-4 inline-block rounded bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground">
            待接入
          </span>
        </div>
        <div className="rounded border border-border bg-surface p-6">
          <h2 className="font-mono text-xs tracking-[.08em] text-primary uppercase">Riot 登录</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            用于国际服玩家绑定与数据同步。接入 Riot Sign On 后启用。
          </p>
          <span className="mt-4 inline-block rounded bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground">
            待接入
          </span>
        </div>
      </section>
      <Link className="inline-flex border-b border-foreground pb-1 text-sm" href="/zh/profile">
        查看账户设置 →
      </Link>
    </PageFrame>
  )
}

import Link from "next/link"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { PreferencesPanel } from "@/components/preferences-panel"

export const metadata: Metadata = { title: "我的账户 | Summoner Atlas" }

export default function ProfilePage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="个人中心"
        title="账户偏好与绑定"
        description="版本偏好本地持久化。账户身份和绑定仍需后端授权服务接入。"
      />
      <section className="grid gap-4 py-12 md:grid-cols-3">
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">版本跟踪</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">当前版本</h2>
          <p className="text-sm leading-6 text-muted-foreground">偏好版本在本地持久化，跟随上下文选择器自动同步。</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">QQ 绑定</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">未连接</h2>
          <p className="text-sm leading-6 text-muted-foreground">接入 OAuth 回调后可绑定国服账号。</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">Riot 绑定</span>
          <h2 className="my-3 text-3xl tracking-[-.03em]">未连接</h2>
          <p className="text-sm leading-6 text-muted-foreground">接入 Riot Sign On 后可绑定国际服账号。</p>
        </article>
      </section>
      <section className="mt-8 border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm tracking-[.06em]">偏好设置</h2>
        <PreferencesPanel />
      </section>
      <div className="mt-8 flex gap-4">
        <Link className="inline-flex border-b border-foreground pb-1 text-sm" href="/zh/profile/accounts">
          账户绑定 →
        </Link>
        <Link className="inline-flex border-b border-foreground pb-1 text-sm" href="/zh/profile/preferences">
          更多偏好 →
        </Link>
      </div>
    </PageFrame>
  )
}

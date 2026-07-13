import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
export const metadata = { title: "我的账户 | summoner-atlas" }
export default function ProfilePage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="个人中心"
        title="账户偏好与绑定"
        description="版本偏好已本地持久化。账户身份、QQ/Riot 绑定仍需后端授权服务，当前状态会如实显示为未连接。"
      />
      <section className="grid gap-4 py-12 md:grid-cols-3 md:pb-28">
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">版本偏好</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">16.13</h2>
          <p className="text-sm leading-6 text-muted-foreground">后续会跟随版本选择器同步。</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">QQ 绑定</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">未连接</h2>
          <p className="text-sm leading-6 text-muted-foreground">未检测到授权服务。</p>
        </article>
        <article className="border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">Riot 绑定</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">未连接</h2>
          <p className="text-sm leading-6 text-muted-foreground">未检测到授权服务。</p>
        </article>
      </section>
      <Link className="mb-28 inline-flex border-b border-foreground pb-1 text-sm" href="/zh/login">
        前往授权说明 →
      </Link>
    </PageFrame>
  )
}

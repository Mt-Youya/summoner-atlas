import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
const sections = [
  ["versions", "数据版本"],
  ["champions", "英雄"],
  ["augments", "海克斯"],
  ["items", "装备"],
  ["users", "用户与角色"],
] as const
export const metadata = { title: "后台管理 | summoner-atlas" }
export default function AdminPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="后台 / 权限边界"
        title="维护入口"
        description="后台路由已建立，但当前仓库没有角色校验或写入 API。所有维护入口在接入服务前均为只读说明，避免未授权的前端写操作。"
      />
      <section className="grid gap-4 py-12 md:grid-cols-3 md:pb-28">
        {sections.map(([slug, label]) => (
          <Link
            className="flex min-h-48 flex-col border border-border bg-surface p-6 hover:bg-surface-raised"
            href={`/zh/admin/${slug}`}
            key={slug}
          >
            <span className="font-mono text-xs text-primary">维护</span>
            <h2 className="my-3 text-3xl tracking-[-.04em]">{label}</h2>
            <p className="text-sm leading-6 text-muted-foreground">待接入权限与数据维护 API</p>
            <b className="mt-auto text-xs">查看状态 →</b>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}

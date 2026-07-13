import Link from "next/link"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"

export const metadata: Metadata = { title: "后台管理 | Summoner Atlas" }

const sections = [
  ["overview", "系统概览"],
  ["sources", "数据源"],
  ["regions", "区域覆盖"],
  ["versions", "数据版本"],
  ["champions", "英雄管理"],
  ["augments", "海克斯管理"],
  ["items", "装备管理"],
  ["users", "用户与角色"],
] as const

export default function AdminPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="后台 / 权限边界"
        title="维护入口"
        description="后台路由已建立。所有维护入口在接入权限校验与写入 API 之前为只读说明状态。"
      />
      <section className="grid gap-4 py-12 md:grid-cols-4 md:pb-28">
        {sections.map(([slug, label]) => (
          <Link
            className="flex min-h-40 flex-col border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
            href={`/zh/admin/${slug}`}
            key={slug}
          >
            <span className="font-mono text-xs text-primary">维护</span>
            <h2 className="my-3 text-2xl tracking-[-.03em]">{label}</h2>
            <p className="text-sm leading-6 text-muted-foreground">待接入权限与数据维护 API</p>
            <b className="mt-auto text-xs">查看状态 →</b>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"

const labels: Record<string, { title: string; description: string }> = {
  overview: { title: "系统概览", description: "数据覆盖、抓取状态、缓存命中率与系统健康。" },
  sources: { title: "数据源管理", description: "管理上游数据源连接、刷新频率与回退策略。" },
  regions: { title: "区域覆盖", description: "各区域数据可用性、延迟与采样率。" },
  versions: { title: "数据版本", description: "管理数据版本生命周期、激活与归档。" },
  champions: { title: "英雄管理", description: "维护英雄基础信息、别名与地区化数据。" },
  augments: { title: "海克斯管理", description: "维护海克斯品质、描述与模式关联。" },
  items: { title: "装备管理", description: "维护装备分类、图标与版本变更。" },
  users: { title: "用户与角色", description: "管理后台用户、角色权限与操作审计。" },
}

interface Props {
  params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = (await params).section
  const info = labels[section]
  return { title: `${info?.title ?? "未知"} | 后台管理` }
}

export default async function AdminSection({ params }: Props) {
  const section = (await params).section
  const info = labels[section]
  if (!info) notFound()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`后台 / ${info.title}`}
        title={`${info.title}维护`}
        description={info.description}
      />
      <section className="my-12 border border-border bg-surface p-6 md:mb-28">
        <h2 className="text-lg">维护服务未连接</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          需要的后端服务：身份会话、角色权限、实体读写、审计日志与失败原因回传。
          所有写操作在接入后需通过 AlertDialog 确认。
        </p>
      </section>
    </PageFrame>
  )
}

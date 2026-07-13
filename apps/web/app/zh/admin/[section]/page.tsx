import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
const labels: Record<string, string> = {
  versions: "数据版本",
  champions: "英雄",
  augments: "海克斯",
  items: "装备",
  users: "用户与角色",
}
export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const section = (await params).section
  const label = labels[section]
  if (!label) notFound()
  return (
    <PageFrame>
      <PageTitle
        eyebrow="后台 / 只读"
        title={`${label}维护`}
        description="该界面等待服务端角色校验、变更审计与写入 API 接入。当前不能提交任何修改，避免在无权限边界下伪造维护能力。"
      />
      <section className="account-notice">
        <h2>维护服务未连接</h2>
        <p>需要的服务：身份会话、角色权限、实体读写、审计日志与失败原因回传。</p>
      </section>
    </PageFrame>
  )
}

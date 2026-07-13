import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
export const metadata = { title: "登录 | summoner-atlas" }
export default function LoginPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="账户"
        title="登录与绑定"
        description="当前重构仓库未包含原系统的授权服务和回调密钥。为保护账户安全，登录、QQ 绑定与 Riot 绑定不会在前端伪造成功状态。"
      />
      <section className="my-12 border border-border bg-surface p-6 md:mb-28">
        <h2>授权服务待接入</h2>
        <p>接入真实 OAuth 回调、会话 API 与权限校验后，这里会显示可执行的登录按钮。</p>
        <Link href="/zh/profile">查看账户设置</Link>
      </section>
    </PageFrame>
  )
}

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
      <section className="account-grid">
        <article>
          <span>版本偏好</span>
          <h2>16.13</h2>
          <p>后续会跟随版本选择器同步。</p>
        </article>
        <article>
          <span>QQ 绑定</span>
          <h2>未连接</h2>
          <p>未检测到授权服务。</p>
        </article>
        <article>
          <span>Riot 绑定</span>
          <h2>未连接</h2>
          <p>未检测到授权服务。</p>
        </article>
      </section>
      <Link className="account-link" href="/zh/login">
        前往授权说明 →
      </Link>
    </PageFrame>
  )
}

import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"

export const metadata = { title: "账户绑定 | summoner-atlas" }

export default function AccountsPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="个人中心 / 账户"
        title="账户与游戏绑定"
        description="QQ 和 Riot 绑定需要 OAuth 回调、用户库与服务端密钥。当前仓库未提供这些服务，因此不会伪造绑定或解绑结果。"
      />
      <Link
        className="my-10 inline-flex border border-black/30 px-4 py-3 text-sm hover:bg-[var(--award-lime)]"
        href="/zh/login"
      >
        查看授权服务状态
      </Link>
    </PageFrame>
  )
}

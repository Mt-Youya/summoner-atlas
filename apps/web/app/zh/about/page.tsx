import { PageFrame, PageTitle } from "@/components/page-frame"
export const metadata = { title: "关于 | summoner-atlas" }
export default function AboutPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="关于"
        title="为开局前的选择留出空间"
        description="summoner-atlas 是一个海克斯大乱斗数据决策界面：用高密度、可追溯的版本数据，帮助玩家更快找到值得尝试的英雄和海克斯。"
      />
    </PageFrame>
  )
}

import { PageFrame, PageTitle } from "@/components/page-frame"
export const metadata = { title: "支持 | summoner-atlas" }
export default function SupportPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="支持与合规"
        title="数据来源与使用说明"
        description="数据来自公开 RESG 接口和 CommunityDragon。英雄联盟及相关素材归 Riot Games 所有；本项目与 Riot Games 没有关联，也未获得其认可。"
      />
      <section className="support-links">
        <a href="https://www.communitydragon.org/" target="_blank" rel="noreferrer">
          CommunityDragon →
        </a>
        <a href="https://developer.riotgames.com/" target="_blank" rel="noreferrer">
          Riot Developer Portal →
        </a>
      </section>
    </PageFrame>
  )
}

import { PageFrame, PageTitle } from "@/components/page-frame"
import { PreferencesPanel } from "@/components/preferences-panel"

export const metadata = { title: "偏好设置 | summoner-atlas" }

export default function PreferencesPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="个人中心 / 偏好"
        title="按你的方式查看数据"
        description="主题和默认版本保存在当前设备，不会复制整张榜单到本地状态。"
      />
      <PreferencesPanel />
    </PageFrame>
  )
}

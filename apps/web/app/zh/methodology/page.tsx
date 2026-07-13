import { PageFrame, PageTitle } from "@/components/page-frame"

export const metadata = { title: "数据方法 | summoner-atlas", description: "了解版本、样本、胜率与可信度的计算方式。" }

export default function MethodologyPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="数据方法 / 可信度"
        title="结论必须能被追溯"
        description="我们将胜率与场次同时呈现：样本越大，结论越稳定；低样本高胜率会被明确降级，而不是作为推荐主结论。"
      />
      <section className="methodology-grid">
        <article>
          <span>01</span>
          <h2>版本固定</h2>
          <p>所有页面都标明数据版本，比较时只应在同版本、同模式与同筛选条件下进行。</p>
        </article>
        <article>
          <span>02</span>
          <h2>样本分级</h2>
          <p>5,000 场以上为高可信；1,000 至 4,999 场为中可信；更低样本标为“样本有限”。</p>
        </article>
        <article>
          <span>03</span>
          <h2>公开可核验</h2>
          <p>英雄与海克斯统计读取公开接口；英雄名称与图标使用 CommunityDragon 资源。</p>
        </article>
        <article>
          <span>04</span>
          <h2>不替代判断</h2>
          <p>数据描述过去样本，不承诺单局结果。阵容、玩家熟练度与对局时点仍会影响实际选择。</p>
        </article>
      </section>
    </PageFrame>
  )
}

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
      <section className="grid gap-4 py-12 md:grid-cols-2 md:pb-28">
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">01</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">版本固定</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            所有页面都标明数据版本，比较时只应在同版本、同模式与同筛选条件下进行。
          </p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">02</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">样本分级</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            5,000 场以上为高可信；1,000 至 4,999 场为中可信；更低样本标为“样本有限”。
          </p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">03</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">公开可核验</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            英雄与海克斯统计读取公开接口；英雄名称与图标使用 CommunityDragon 资源。
          </p>
        </article>
        <article className="min-h-52 border border-border bg-surface p-6">
          <span className="font-mono text-xs text-primary">04</span>
          <h2 className="my-3 text-3xl tracking-[-.04em]">不替代判断</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            数据描述过去样本，不承诺单局结果。阵容、玩家熟练度与对局时点仍会影响实际选择。
          </p>
        </article>
      </section>
    </PageFrame>
  )
}

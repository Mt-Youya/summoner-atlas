import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-[min(100%-3rem,45rem)] content-center gap-5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-primary">404 / 路由不存在</span>
      <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">没有找到这条数据。</h1>
      <p className="leading-8 text-muted-foreground">
        链接可能已过期，或当前版本没有对应实体。返回首页后重新搜索英雄或海克斯。
      </p>
      <Link className="w-max border border-primary px-4 py-3 text-primary" href="/zh">
        返回首页 →
      </Link>
    </main>
  )
}

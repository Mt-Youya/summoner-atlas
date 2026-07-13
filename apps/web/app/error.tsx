"use client"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[70vh] w-[min(100%-3rem,45rem)] content-center gap-5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-cyan-500">数据暂不可用</span>
      <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">无法加载本页数据。</h1>
      <p className="leading-8 text-white/65">请检查网络后重试；问题持续时可返回首页切换其他数据入口。</p>
      <button className="w-max border border-cyan-400 px-4 py-3 text-cyan-400" type="button" onClick={reset}>
        重新加载
      </button>
    </main>
  )
}

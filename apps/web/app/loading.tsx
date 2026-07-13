export default function Loading() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-[min(100%-3rem,45rem)] content-center gap-5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-cyan-500">数据加载中</span>
      <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">正在准备版本数据。</h1>
      <p className="leading-8 text-white/65">正在读取公开数据快照。</p>
    </main>
  )
}

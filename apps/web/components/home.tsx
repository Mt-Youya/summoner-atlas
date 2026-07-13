"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ChartUpIcon,
  CommandIcon,
  Database01Icon,
  Menu01Icon,
  Search01Icon,
  ShieldEnergyIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

gsap.registerPlugin(useGSAP)

const champions = [
  { id: 67, name: "薇恩", tier: "S+", winRate: "59.63%", matches: "34,541", note: "稳定强势" },
  { id: 14, name: "赛恩", tier: "S", winRate: "57.94%", matches: "30,270", note: "前排核心" },
  { id: 104, name: "格雷福斯", tier: "S", winRate: "57.66%", matches: "33,745", note: "持续输出" },
  { id: 876, name: "莉莉娅", tier: "S", winRate: "57.24%", matches: "28,311", note: "高机动" },
  { id: 222, name: "金克丝", tier: "S", winRate: "56.74%", matches: "27,028", note: "收割能力" },
]

const augments = [
  { name: "升级：无尽之刃", quality: "棱彩", winRate: "52.37%", matches: "233,732" },
  { name: "坦克引擎", quality: "棱彩", winRate: "52.01%", matches: "266,490" },
  { name: "术士果汁盒", quality: "黄金", winRate: "51.30%", matches: "224,346" },
  { name: "魔法飞弹", quality: "黄金", winRate: "50.06%", matches: "194,864" },
]

const searchCatalog = [
  ...champions.map((champion) => ({
    ...champion,
    kind: "英雄" as const,
    aliases:
      {
        薇恩: ["vayne", "vn", "暗夜猎手"],
        赛恩: ["sion", "亡灵战神"],
        格雷福斯: ["graves", "男枪", "法外狂徒"],
        莉莉娅: ["lillia", "lilia", "含羞蓓蕾"],
        金克丝: ["jinx", "暴走萝莉"],
      }[champion.name] ?? [],
    anchor: "champions",
  })),
  ...augments.map((augment) => ({
    ...augment,
    kind: "海克斯" as const,
    aliases: [augment.name.replaceAll("：", "")],
    anchor: "augments",
  })),
]

const championIcon = (id: number) =>
  `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`

export function Home() {
  const root = useRef<HTMLElement>(null)
  const searchShell = useRef<HTMLDivElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()
  const searchResults = normalizedQuery
    ? searchCatalog
        .filter((entry) =>
          [entry.name, ...entry.aliases].some((value) => value.toLowerCase().includes(normalizedQuery))
        )
        .slice(0, 6)
    : []

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: "(min-width: 800px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean
            reduceMotion: boolean
          }

          if (reduceMotion) {
            gsap.set("[data-reveal], .pulse-node, .rank-row", { clearProps: "all" })
            return
          }

          const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
          timeline
            .from(".nav-shell", { y: -24, duration: 0.55 })
            .from(".hero-kicker", { x: desktop ? -32 : 0, y: desktop ? 0 : 18, duration: 0.5 }, "-=0.22")
            .from(".hero-line", { yPercent: 24, duration: 0.8, stagger: 0.1 }, "-=0.24")
            .from(".hero-support", { y: 18, duration: 0.55 }, "-=0.38")
            .from(".search-stage", { scale: 0.97, y: 20, duration: 0.7 }, "-=0.32")
            .from(
              ".pulse-node",
              { scale: 0.3, autoAlpha: 0.25, duration: 0.45, stagger: 0.07, ease: "back.out(1.8)" },
              "-=0.3"
            )
            .from("[data-reveal]", { y: 26, duration: 0.6, stagger: 0.08 }, "-=0.15")

          gsap.to(".radar-sweep", {
            rotation: "360_cw",
            transformOrigin: "50% 50%",
            duration: 16,
            repeat: -1,
            ease: "none",
          })
        },
        root
      )

      return () => mm.revert()
    },
    { scope: root }
  )

  const onSearchFocus = contextSafe(() => {
    gsap.to(searchShell.current, { scale: 1.012, duration: 0.2, ease: "power2.out", overwrite: "auto" })
  })

  const onSearchBlur = contextSafe(() => {
    gsap.to(searchShell.current, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" })
  })

  const goToFirstResult = () => {
    const firstResult = searchResults[0]
    if (!firstResult) return
    document.getElementById(firstResult.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main ref={root} className="site-shell">
      <header className="nav-shell">
        <a href="#top" className="brand" aria-label="summoner-atlas 首页">
          <span className="brand-mark">R</span>
          <span>summoner-atlas</span>
        </a>
        <nav aria-label="主导航">
          <a href="/zh/champions">英雄榜</a>
          <a href="/zh/augments">海克斯榜</a>
          <a href="/zh/combinations">组合研究</a>
        </nav>
        <div className="nav-actions">
          <Button className="version-button" variant="outline" type="button">
            <span /> 16.13
          </Button>
          <Button
            className="icon-button"
            variant="outline"
            size="icon"
            type="button"
            aria-label="打开菜单"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.8} />
          </Button>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="mobile-menu">
            <a href="/zh/champions" onClick={() => setIsMenuOpen(false)}>
              英雄榜
            </a>
            <a href="/zh/augments" onClick={() => setIsMenuOpen(false)}>
              海克斯榜
            </a>
            <a href="/zh/combinations" onClick={() => setIsMenuOpen(false)}>
              组合研究
            </a>
            <a href="/zh/methodology" onClick={() => setIsMenuOpen(false)}>
              数据方法
            </a>
          </div>
        )}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span /> 海克斯大乱斗 · 即时版本决策台
          </div>
          <h1 aria-label="选对，再开">
            <span className="hero-line-wrap">
              <span className="hero-line">选对</span>
            </span>
            <span className="hero-line-wrap">
              <span className="hero-line hero-line-accent">再开。</span>
            </span>
          </h1>
          <p className="hero-support">
            把复杂版本数据压缩成一个清晰选择。
            <br />
            搜英雄、看海克斯，开局前 8 秒找到答案。
          </p>
        </div>

        <div className="search-stage">
          <div className="radar" aria-hidden="true">
            <span className="radar-ring radar-ring-1" />
            <span className="radar-ring radar-ring-2" />
            <span className="radar-cross radar-cross-x" />
            <span className="radar-cross radar-cross-y" />
            <span className="radar-sweep" />
            <span className="pulse-node node-1" />
            <span className="pulse-node node-2" />
            <span className="pulse-node node-3" />
          </div>
          <div className="search-cluster">
            <div className="search-label">
              <span>全局检索</span>
              <kbd>
                <HugeiconsIcon icon={CommandIcon} size={12} /> K
              </kbd>
            </div>
            <div ref={searchShell} className="search-shell">
              <HugeiconsIcon icon={Search01Icon} size={24} strokeWidth={1.6} />
              <input
                ref={searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                onKeyDown={(event) => {
                  if (event.key === "Enter") goToFirstResult()
                }}
                placeholder="搜索英雄、拼音、外号或海克斯"
                aria-label="搜索英雄或海克斯"
                aria-expanded={Boolean(normalizedQuery)}
                aria-controls="global-search-results"
              />
              <Button type="button" aria-label="查看首个搜索结果" onClick={goToFirstResult}>
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Button>
            </div>
            <div className="search-hints">
              <span>试试：</span>
              <button type="button" onClick={() => setQuery("薇恩")}>
                薇恩
              </button>
              <button type="button" onClick={() => setQuery("坦克引擎")}>
                坦克引擎
              </button>
              <button type="button" onClick={() => setQuery("无限火力")}>
                无限火力
              </button>
            </div>
            {normalizedQuery && (
              <div id="global-search-results" className="search-results" role="status" aria-live="polite">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <a
                      href={`#${result.anchor}`}
                      key={`${result.kind}-${result.name}`}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <span className="result-kind">{result.kind}</span>
                      <strong>{result.name}</strong>
                      <span>
                        {result.kind === "英雄"
                          ? `${result.winRate} 胜率`
                          : `${result.quality} · ${result.winRate} 胜率`}
                      </span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                    </a>
                  ))
                ) : (
                  <p>没有找到“{query}”相关的英雄或海克斯。</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="version-track" aria-label="当前数据版本">
        <div className="track-lead">
          <span className="live-dot" />
          <div>
            <small>当前版本</small>
            <strong>16.13</strong>
          </div>
        </div>
        <div className="track-line">
          <span />
        </div>
        <dl>
          <div>
            <dt>数据状态</dt>
            <dd>公开数据快照</dd>
          </div>
          <div>
            <dt>英雄样本</dt>
            <dd>3,218,000+</dd>
          </div>
          <div>
            <dt>来源</dt>
            <dd>summoner-atlas / CDragon</dd>
          </div>
        </dl>
      </section>

      <section className="decision-section" id="decisions" data-reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">快速决策 / 版本 16.13</span>
            <h2>现在值得选什么？</h2>
          </div>
          <p>跳过长表，先看高样本结论。所有百分比同时附带场次，避免被低样本误导。</p>
        </div>
        <div className="decision-grid">
          <article className="featured-decision">
            <div className="decision-top">
              <span className="decision-icon">
                <HugeiconsIcon icon={ChartUpIcon} />
              </span>
              <span className="confidence">高可信</span>
            </div>
            <p>稳定强势</p>
            <h3>薇恩</h3>
            <div className="hero-champion">
              <Image src={championIcon(67)} alt="暗夜猎手 薇恩" fill sizes="(max-width: 700px) 70vw, 360px" priority />
              <span className="image-mask" />
            </div>
            <div className="decision-metric">
              <strong>59.63%</strong>
              <span>
                胜率
                <br />
                34,541 场
              </span>
            </div>
            <a href="/zh/champions/67">
              查看英雄数据 <HugeiconsIcon icon={ArrowRight01Icon} />
            </a>
          </article>
          <div className="decision-stack">
            <article>
              <div>
                <span className="decision-icon">
                  <HugeiconsIcon icon={ShieldEnergyIcon} />
                </span>
                <span className="confidence">高可信</span>
              </div>
              <p>前排核心</p>
              <h3>赛恩</h3>
              <dl>
                <div>
                  <dt>胜率</dt>
                  <dd>57.94%</dd>
                </div>
                <div>
                  <dt>场次</dt>
                  <dd>30,270</dd>
                </div>
              </dl>
            </article>
            <article>
              <div>
                <span className="decision-icon">
                  <HugeiconsIcon icon={SparklesIcon} />
                </span>
                <span className="confidence gold">海克斯</span>
              </div>
              <p>高样本选择</p>
              <h3>升级：无尽之刃</h3>
              <dl>
                <div>
                  <dt>胜率</dt>
                  <dd>52.37%</dd>
                </div>
                <div>
                  <dt>场次</dt>
                  <dd>233,732</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section className="rankings" data-reveal>
        <RankingList />
        <AugmentList />
      </section>

      <section className="method-strip" id="methodology" data-reveal>
        <div className="method-icon">
          <HugeiconsIcon icon={Database01Icon} size={26} />
        </div>
        <div>
          <span className="eyebrow">不是玄学推荐</span>
          <h2>每个结论，都能追溯到样本。</h2>
        </div>
        <p>排名同时参考胜率与场次。数据来自 summoner-atlas 公开接口快照，英雄资源由 CommunityDragon 提供。</p>
        <a href="https://www.summoner-atlas.top/" target="_blank" rel="noreferrer">
          查看现有数据站 <HugeiconsIcon icon={ArrowRight01Icon} />
        </a>
      </section>

      <footer>
        <div className="brand">
          <span className="brand-mark">R</span>
          <span>summoner-atlas</span>
        </div>
        <p>summoner-atlas 与 Riot Games 没有关联，也未获得其认可。英雄联盟及相关素材归 Riot Games 所有。</p>
        <span>© 2026 summoner-atlas</span>
      </footer>
      <nav className="mobile-bottom-nav" aria-label="移动端导航">
        <a href="/zh/champions">英雄榜</a>
        <a href="/zh/augments">海克斯榜</a>
        <a href="/zh/combinations">组合</a>
        <a href="/zh/methodology">数据</a>
      </nav>
    </main>
  )
}

function RankingList() {
  return (
    <div className="ranking-panel" id="champions">
      <div className="panel-title">
        <div>
          <span className="eyebrow">英雄榜</span>
          <h2>高胜率英雄</h2>
        </div>
        <a href="/zh/champions">
          完整榜单 <HugeiconsIcon icon={ArrowRight01Icon} />
        </a>
      </div>
      <div className="table-head">
        <span>排名 / 英雄</span>
        <span>Tier</span>
        <span>胜率</span>
        <span>场次</span>
      </div>
      {champions.map((champion, index) => (
        <a href={`/zh/champions/${champion.id}`} className="rank-row" key={champion.id}>
          <div className="identity">
            <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>
            <Image src={championIcon(champion.id)} alt={champion.name} width={44} height={44} />
            <span>
              <strong>{champion.name}</strong>
              <small>{champion.note}</small>
            </span>
          </div>
          <strong className="tier">{champion.tier}</strong>
          <strong className="win-rate">{champion.winRate}</strong>
          <span className="matches">{champion.matches}</span>
        </a>
      ))}
    </div>
  )
}

function AugmentList() {
  return (
    <div className="ranking-panel" id="augments">
      <div className="panel-title">
        <div>
          <span className="eyebrow">海克斯榜</span>
          <h2>高样本选择</h2>
        </div>
        <a href="/zh/augments">
          完整榜单 <HugeiconsIcon icon={ArrowRight01Icon} />
        </a>
      </div>
      <div className="table-head augment-head">
        <span>海克斯</span>
        <span>品质</span>
        <span>胜率</span>
        <span>场次</span>
      </div>
      {augments.map((augment, index) => (
        <a href="/zh/augments" className="rank-row augment-row" key={augment.name}>
          <div className="identity augment-identity">
            <span className="augment-glyph">{index + 1}</span>
            <span>
              <strong>{augment.name}</strong>
              <small>样本充分</small>
            </span>
          </div>
          <span className={`quality ${augment.quality === "棱彩" ? "prismatic" : "golden"}`}>{augment.quality}</span>
          <strong className="win-rate">{augment.winRate}</strong>
          <span className="matches">{augment.matches}</span>
        </a>
      ))}
    </div>
  )
}

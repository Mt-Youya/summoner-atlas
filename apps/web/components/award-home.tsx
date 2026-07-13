"use client"

import Link from "next/link"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const stories = [
  { image: "https://picsum.photos/seed/abyss-vayne/1280/960", name: "薇恩", stat: "59.63%", href: "/zh/champions/67" },
  { image: "https://picsum.photos/seed/abyss-sion/1280/960", name: "赛恩", stat: "57.94%", href: "/zh/champions/14" },
  {
    image: "https://picsum.photos/seed/abyss-lillia/1280/960",
    name: "莉莉娅",
    stat: "57.24%",
    href: "/zh/champions/876",
  },
]

const manifesto = "不是把更多数字塞进屏幕，而是让每一次选择都有据可循。版本在变，答案不该藏在长表里。"
const marqueeHeroes = ["薇恩", "赛恩", "格雷福斯", "莉莉娅", "金克丝"].join("　·　")

export function AwardHome() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 800px)" }, (context) => {
        const { reduce, desktop } = context.conditions as { reduce: boolean; desktop: boolean }
        if (reduce) return
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } })
        intro
          .from(".award-nav", { y: -28, autoAlpha: 0, duration: 0.7 })
          .from(".award-hero h1 span", { yPercent: 108, duration: 1, stagger: 0.12 }, "-=0.35")
          .from(".award-hero-copy", { y: 22, autoAlpha: 0, duration: 0.7 }, "-=0.55")
          .from(".award-hero-actions a", { y: 16, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, "-=0.45")
        gsap.utils.toArray<HTMLElement>(".scroll-image").forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 0.82, autoAlpha: 0.25 },
            {
              scale: 1,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: { trigger: image, start: "top 90%", end: "bottom 30%", scrub: 0.7 },
            }
          )
        })
        gsap.to(".story-word", {
          color: "var(--award-ink)",
          opacity: 1,
          stagger: 0.028,
          ease: "none",
          scrollTrigger: {
            trigger: ".manifesto",
            start: desktop ? "top 72%" : "top 82%",
            end: "bottom 48%",
            scrub: 0.8,
          },
        })
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <main ref={root} className="award-home">
      <nav className="award-nav" aria-label="主导航">
        <Link href="/zh" className="award-brand">
          <span>SUMMONER</span>
          <i /> <span>ATLAS</span>
        </Link>
        <div className="award-nav-links">
          <Link href="/zh/champions">英雄</Link>
          <Link href="/zh/augments">海克斯</Link>
          <Link href="/zh/combinations">组合</Link>
        </div>
        <Link href="/zh/profile" className="award-account">
          账户 <HugeiconsIcon icon={ArrowRight01Icon} />
        </Link>
      </nav>

      <section className="award-hero">
        <div className="award-hero-art" aria-hidden="true" />
        <div className="award-hero-content">
          <p className="award-overline">海克斯大乱斗数据工作台</p>
          <h1>
            <span>让版本</span>
            <span>
              先替你 <em className="inline-image" /> 说话。
            </span>
          </h1>
          <div className="award-hero-copy">
            <p>没有模糊的推荐，没有低样本幻觉。只留下足以改变一次开局的判断。</p>
            <div className="award-hero-actions">
              <Link href="/zh/champions">
                探索英雄榜 <HugeiconsIcon icon={ArrowRight01Icon} />
              </Link>
              <Link href="/zh/augments">查看海克斯</Link>
            </div>
          </div>
        </div>
        <div className="award-search">
          <HugeiconsIcon icon={Search01Icon} />
          <Link href="/zh/champions">搜索英雄、拼音、外号或海克斯</Link>
          <kbd>⌘ K</kbd>
        </div>
      </section>

      <div className="award-marquee" aria-label="当前版本热门英雄">
        <div>
          {marqueeHeroes}　·　{marqueeHeroes}　·
        </div>
      </div>

      <section className="award-interest">
        <div className="award-section-intro">
          <p>当每个人都在看数字，少数人看见趋势。</p>
          <Link href="/zh/methodology">
            我们如何判断可信度 <HugeiconsIcon icon={ArrowRight01Icon} />
          </Link>
        </div>
        <div className="award-bento">
          <Link href="/zh/champions/67" className="award-bento-main">
            <div>
              <span>当前版本的稳定答案</span>
              <h2>薇恩</h2>
              <p>59.63% 胜率，34,541 场对局。不是偶然峰值，而是足够长的样本线。</p>
            </div>
            <strong>01</strong>
          </Link>
          <Link href="/zh/augments" className="award-bento-wide award-bento-augment">
            <span>233,732 场</span>
            <h3>升级：无尽之刃</h3>
            <p>高样本海克斯，不靠一时的高光。</p>
          </Link>
          <Link href="/zh/combinations" className="award-bento-wide award-bento-combo">
            <span>把选择串起来</span>
            <h3>英雄 · 海克斯 · 出装</h3>
            <p>从第一个选择，走到完整方案。</p>
          </Link>
        </div>
      </section>

      <section className="award-desire">
        <p className="award-overline">每一次点击，都应该更接近答案</p>
        <p className="manifesto">
          {manifesto.split("").map((word, index) => (
            <span className="story-word" key={`${word}-${index}`}>
              {word}
            </span>
          ))}
        </p>
        <div className="award-gallery">
          {stories.map((story, index) => (
            <Link href={story.href} className={`scroll-image scroll-image-${index + 1}`} key={story.name}>
              <img src={story.image} alt={`${story.name} 的战术影像`} />
              <div>
                <span>{story.name}</span>
                <strong>{story.stat}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="award-action">
        <p>你的下一次选择，不该靠猜。</p>
        <h2>
          现在，
          <br />
          从一位英雄开始。
        </h2>
        <Link href="/zh/champions">
          进入数据工作台 <HugeiconsIcon icon={ArrowRight01Icon} />
        </Link>
      </section>
      <footer className="award-footer">
        <span>SUMMONER ATLAS</span>
        <span>数据版本 16.13</span>
        <Link href="/zh/support">数据来源与声明</Link>
      </footer>
    </main>
  )
}

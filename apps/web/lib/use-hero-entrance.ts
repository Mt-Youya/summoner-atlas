"use client"

import { useEffect, type RefObject } from "react"
import gsap from "gsap"

interface TweenConfig {
  /** CSS selector or data-attribute for the target element */
  target: string
  /** gsap.fromTo vars — opacity/y/scale etc. */
  from: gsap.TweenVars
  /** gsap.fromTo vars */
  to: gsap.TweenVars
}

/**
 * Shared GSAP entrance animation for detail-page hero sections.
 * Only runs on >=1024px viewports with no reduced-motion preference.
 */
export function useHeroEntrance(containerRef: RefObject<HTMLElement | null>, tweens: TweenConfig[]) {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        tweens.forEach(({ target, from, to }) => {
          gsap.fromTo(target, from, to)
        })
      }, containerRef)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [containerRef, tweens])
}

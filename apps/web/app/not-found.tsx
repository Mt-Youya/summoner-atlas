"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Home01Icon, Alert01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"

const RACCOON_VIDEO_URL =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/videos/generated/131e814c-2206-4271-99a9-67b4cc0630a6.mp4"

export default function NotFound() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top })
        setIsHovering(true)
      }
    }
    function handleMouseLeave() {
      setIsHovering(false)
    }
    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-background select-none">
      {/* Star field + grid layers */}
      <div className="absolute inset-0 bg-starfield opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Video background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
        <video
          src={RACCOON_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
        />
      </div>

      <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 px-4">
        {/* Large watermark 404 */}
        <h1
          className="text-[10rem] md:text-[14rem] font-bold tracking-tighter leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.04] text-foreground"
          aria-hidden
        >
          404
        </h1>

        <div className="relative z-20 text-center max-w-xl mx-auto">
          {/* Badge */}
          <div className="inline-block bg-primary text-primary-foreground font-bold px-4 py-1 -rotate-2 mb-6 text-sm tracking-widest uppercase shadow-[var(--glow-mid)]">
            {t("caseFile404")}
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {t("missingInAction")}
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed mb-10">
            {t("missingInActionDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              nativeButton={false}
              className="shadow-[var(--glow-mid)]"
              render={
                <Link href="/">
                  <HugeiconsIcon icon={Home01Icon} data-icon="inline-start" />
                  {t("abortMission")}
                </Link>
              }
            />
            <Button variant="outline" size="lg" className="gap-2">
              <HugeiconsIcon icon={Alert01Icon} data-icon="inline-start" />
              {t("backToHome")}
            </Button>
          </div>
        </div>
      </div>

      {/* Flashlight overlay */}
      <div
        className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(10,14,23,0.97) 100%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Glow spot */}
      <div
        className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-75"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,212,255,0.12) 0%, transparent 40%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Crosshair cursor */}
      <div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
      >
        <div className="w-full h-full border-2 border-primary rounded-full opacity-50 shadow-[var(--glow-low)]" />
        <div className="absolute top-1/2 left-1/2 size-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

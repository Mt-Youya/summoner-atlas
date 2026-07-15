"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Loading02Icon, Home01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation()
  const [glitching, setGlitching] = useState(false)
  const [isRebooting, setIsRebooting] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    "> SYSTEM CRITICAL FAILURE DETECTED",
    "> ERROR CODE: 500",
    "> INITIATING RECOVERY PROTOCOL...",
  ])

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 120)
    }, 3000)
    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    const messages = [
      "> RETRYING CONNECTION...",
      "> PACKET LOSS DETECTED",
      "> RECALIBRATING ATLAS CORE...",
      "> UNIT 734: 'I'M TRYING!'",
      "> SIGNAL WEAK — BOOSTING",
      "> STACK OVERFLOW IN SECTOR 7G",
      "> RE-ROUTING THROUGH BACKUP NODE",
    ]
    const logInterval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)]
      setLogs((prev) => [...prev.slice(-6), `${msg} [${new Date().toLocaleTimeString()}]`])
    }, 2000)
    return () => clearInterval(logInterval)
  }, [])

  const handleReboot = useCallback(() => {
    setIsRebooting(true)
    setLogs((prev) => [...prev, "> FORCED REBOOT INITIATED..."])
    setTimeout(() => reset(), 1500)
  }, [reset])

  return (
    <div className="relative w-full min-h-[90vh] bg-background overflow-hidden flex items-center justify-center">
      {/* Star field + grid */}
      <div className="absolute inset-0 bg-starfield opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        {/* Glitch 500 */}
        <div className="text-center mb-8">
          <h1
            className={cn(
              "text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary mb-4 transition-all duration-100 font-mono tracking-widest",
              glitching && "translate-x-1 blur-[2px]"
            )}
            style={{
              textShadow: glitching ? "2px 0 #00D4FF, -2px 0 #7B2FBE" : "none",
            }}
          >
            500
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2 tracking-wide uppercase">
            {t("internalSystemFailure")}
          </h2>

          <p className="text-muted-foreground text-base max-w-md mx-auto">{t("internalSystemFailureDesc")}</p>
        </div>

        {/* System status panel */}
        <div className="bg-muted/40 backdrop-blur-sm border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("systemStatus")}</div>
              <div className="text-destructive font-mono flex items-center text-sm">
                <span className="inline-block size-2 bg-destructive rounded-full mr-2 animate-pulse" />
                {t("criticalError")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("errorCodeLabel")}</div>
              <div className="text-foreground font-mono text-sm">ATLAS-500-CORE</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("timestamp")}</div>
              <div className="text-foreground font-mono text-sm">{new Date().toISOString().split(".")[0]}Z</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("errorLevel")}</div>
              <div className="text-amber-400 font-mono text-sm">LEVEL 3</div>
            </div>
          </div>
        </div>

        {/* System logs */}
        <div className="bg-black/40 backdrop-blur-sm border rounded-lg p-4 mb-6 font-mono text-xs leading-relaxed">
          {logs.map((line, i) => (
            <div
              key={i}
              className={cn("transition-colors", i === logs.length - 1 ? "text-primary" : "text-muted-foreground/60")}
            >
              {line}
            </div>
          ))}
          <div className="w-3 h-4 bg-primary inline-block animate-pulse ml-0.5 align-middle" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button onClick={handleReboot} disabled={isRebooting} className="flex-1 shadow-[var(--glow-mid)]" size="lg">
            <HugeiconsIcon
              icon={Loading02Icon}
              data-icon="inline-start"
              className={cn(isRebooting && "animate-spin")}
            />
            {isRebooting ? t("rebooting") : t("rebootSystem")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="flex-1"
            render={
              <Link href="/">
                <HugeiconsIcon icon={Home01Icon} data-icon="inline-start" />
                {t("backToHome")}
              </Link>
            }
          />
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground/40 font-mono">
          ATLAS CORE SYSTEM v25.14 | {t("emergencyProtocolActive")}
        </div>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.15) 2px, rgba(0,212,255,0.15) 4px)",
        }}
      />
    </div>
  )
}

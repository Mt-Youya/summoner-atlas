"use client"

import { UserIcon, Sword01Icon, MagicWand01Icon, Sun01Icon, Moon01Icon } from "hugeicons-react"
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, Separator } from "@summoner-atlas/ui"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "@/hooks/use-theme"

export default function ProfilePage() {
  const { t } = useTranslation()
  const theme = useTheme((s) => s.theme)
  const toggleTheme = useTheme((s) => s.toggle)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowAccount")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("profilePage")}</h1>
      </div>

      {/* User avatar section */}
      <Card>
        <CardContent className="flex items-center gap-5 p-6">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center">
            <UserIcon className="size-8 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-foreground">Summoner</h2>
            <p className="text-sm text-muted-foreground">{t("loginDesc")}</p>
          </div>
          <Badge variant="secondary">{t("pending")}</Badge>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t("displayPreferences")}</CardTitle>
          <CardDescription>{t("morePreferences")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon01Icon className="size-5" /> : <Sun01Icon className="size-5" />}
              <span className="text-sm font-medium">{theme === "dark" ? t("dark") : t("light")}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-7 rounded-full transition-colors bg-muted hover:bg-muted/80"
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-primary shadow-[var(--glow-low)] transition-all ${
                  theme === "dark" ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Account binding */}
      <Card>
        <CardHeader>
          <CardTitle>{t("accountBinding")}</CardTitle>
          <CardDescription>{t("profileAccounts")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <Sword01Icon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("qqLogin")}</p>
                <p className="text-xs text-muted-foreground">{t("qqBindDesc")}</p>
              </div>
            </div>
            <Badge variant="outline">{t("pending")}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <MagicWand01Icon className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("riotLogin")}</p>
                <p className="text-xs text-muted-foreground">{t("riotBindDesc")}</p>
              </div>
            </div>
            <Badge variant="outline">{t("pending")}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">{t("authServicePending")}</p>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground text-center">{t("maintenancePending")}</p>
    </div>
  )
}

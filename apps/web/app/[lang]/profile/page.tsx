"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { UserIcon, Sword01Icon, MagicWand01Icon, Sun01Icon, Moon01Icon } from "@hugeicons/core-free-icons"
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, Separator, Switch, Label } from "@summoner-atlas/ui"
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
            <HugeiconsIcon icon={UserIcon} className="size-8 text-muted-foreground" />
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
            <Label htmlFor="theme-switch" className="flex items-center gap-3 cursor-pointer">
              {theme === "dark" ? (
                <HugeiconsIcon icon={Moon01Icon} className="size-5" />
              ) : (
                <HugeiconsIcon icon={Sun01Icon} className="size-5" />
              )}
              <span className="text-sm font-medium">{theme === "dark" ? t("dark") : t("light")}</span>
            </Label>
            <Switch id="theme-switch" checked={theme === "dark"} onCheckedChange={toggleTheme} />
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
              <HugeiconsIcon icon={Sword01Icon} className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("qqLogin")}</p>
                <p className="text-xs text-muted-foreground">{t("qqBindDesc")}</p>
              </div>
            </div>
            <Badge variant="outline">{t("pending")}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={MagicWand01Icon} className="size-5 text-muted-foreground" />
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

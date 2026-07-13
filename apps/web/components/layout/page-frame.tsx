import { Separator } from "@summoner-atlas/ui/separator"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export async function PageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto min-h-screen w-[min(100%-2rem,1280px)]">
      <SiteHeader />
      {children}
      <Separator />
      <SiteFooter />
    </main>
  )
}

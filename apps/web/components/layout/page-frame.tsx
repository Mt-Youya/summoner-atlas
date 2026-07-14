import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export async function PageFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto min-h-screen w-[min(100%-2rem,1280px)]">{children}</main>
      <SiteFooter />
    </>
  )
}

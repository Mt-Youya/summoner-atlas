import { ThemeProvider } from "@/components/layout/theme-provider"
import { NavBar } from "@/components/layout/nav-bar"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { Footer } from "@/components/layout/footer"
import { TooltipProvider } from "@summoner-atlas/ui/tooltip"
import { CommandPalette } from "@/components/command-palette"

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <CommandPalette />
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1 overflow-x-hidden w-full max-w-full">{children}</main>
          <MobileTabBar />
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "dark" | "light"

interface ThemeState {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggle: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark"
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark")
          }
          return { theme: next }
        }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark")
        }
        set({ theme })
      },
    }),
    {
      name: "summoner-atlas-theme",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", state.theme === "dark")
        }
      },
    }
  )
)

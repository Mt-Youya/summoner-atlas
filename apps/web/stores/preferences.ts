import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "dark" | "light"

interface PreferencesState {
  theme: Theme
  version: string
  setTheme: (theme: Theme) => void
  setVersion: (version: string) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "dark",
      version: "16.13",
      setTheme: (theme) => set({ theme }),
      setVersion: (version) => set({ version }),
    }),
    { name: "summoner-atlas-preferences" }
  )
)

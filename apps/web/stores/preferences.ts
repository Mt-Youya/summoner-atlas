import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PreferencesState {
  theme: "dark" | "light"
  version: string
  recentlyViewed: number[]
  setTheme: (theme: "dark" | "light") => void
  setVersion: (version: string) => void
  addRecentlyViewed: (id: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "dark",
      version: "16.13",
      recentlyViewed: [],
      setTheme: (theme) => set({ theme }),
      setVersion: (version) => set({ version }),
      addRecentlyViewed: (id) =>
        set((state) => ({
          recentlyViewed: [id, ...state.recentlyViewed.filter((i) => i !== id)].slice(0, 10),
        })),
    }),
    { name: "summoner-atlas-preferences" }
  )
)

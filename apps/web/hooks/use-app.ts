"use client"

import { create } from "zustand"
import type { GameMode, Region } from "@/lib/data-service"

interface AppState {
  gameMode: GameMode
  region: Region
  setGameMode: (mode: GameMode) => void
  setRegion: (region: Region) => void
}

export const useApp = create<AppState>()((set) => ({
  gameMode: "aram",
  region: "cn",
  setGameMode: (gameMode) => set({ gameMode }),
  setRegion: (region) => set({ region }),
}))

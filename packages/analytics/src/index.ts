const EVENTS = {
  pageView: "page_view",
  search: "search",
  championView: "champion_view",
  augmentView: "augment_view",
  itemView: "item_view",
  runeView: "rune_view",
  contextChange: "context_change",
  filterApply: "filter_apply",
  buildResearch: "build_research",
  compareView: "compare_view",
  modeSwitch: "mode_switch",
  regionSwitch: "region_switch",
  versionSwitch: "version_switch",
  loginStart: "login_start",
} as const

type EventName = (typeof EVENTS)[keyof typeof EVENTS]

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, string | number | boolean>
}

export function track(name: EventName, properties?: AnalyticsEvent["properties"]) {
  if (typeof window === "undefined") return
  try {
    window.dispatchEvent(
      new CustomEvent("summoner-atlas:analytics", {
        detail: { name, properties, timestamp: Date.now() },
      }),
    )
  } catch {
    // Analytics should never break the app
  }
}

export const funnel = {
  entry: () => track(EVENTS.pageView),
  search: (query: string) => track(EVENTS.search, { query }),
  openEntity: (type: string, id: number) =>
    track(type === "champion" ? EVENTS.championView : type === "augment" ? EVENTS.augmentView : EVENTS.itemView, { id }),
  changeContext: (key: string, value: string) => track(EVENTS.contextChange, { [key]: value }),
  applyFilter: (filters: Record<string, string>) => track(EVENTS.filterApply, filters),
  researchBuild: (championId: number) => track(EVENTS.buildResearch, { championId }),
  compare: (ids: number[]) => track(EVENTS.compareView, { count: ids.length }),
  switchMode: (mode: string) => track(EVENTS.modeSwitch, { mode }),
  switchRegion: (region: string) => track(EVENTS.regionSwitch, { region }),
  switchVersion: (version: string) => track(EVENTS.versionSwitch, { version }),
  loginStart: (provider: string) => track(EVENTS.loginStart, { provider }),
}

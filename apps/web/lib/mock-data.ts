import type {
  Champion,
  Augment,
  PatchSummary,
  ChampionRank,
  ChampionTrend,
  AugmentRank,
  ChampionSearchResult,
  ChampionDetail,
  AtlasGraphData,
  DataService,
} from "./data-service"

/* ── Mock data pool ── */

const champions: Champion[] = [
  {
    id: "aatrox",
    name: "Aatrox",
    nameZh: "暗裔剑魔",
    aliases: ["剑魔", "aateluoke"],
    avatarUrl: "/champions/aatrox.png",
    splashUrl: "https://picsum.photos/seed/aatrox/800/450",
  },
  {
    id: "ahri",
    name: "Ahri",
    nameZh: "九尾妖狐",
    aliases: ["狐狸", "阿里", "ahri"],
    avatarUrl: "/champions/ahri.png",
    splashUrl: "https://picsum.photos/seed/ahri/800/450",
  },
  {
    id: "akali",
    name: "Akali",
    nameZh: "离群之刺",
    aliases: ["阿卡丽", "akali"],
    avatarUrl: "/champions/akali.png",
    splashUrl: "https://picsum.photos/seed/akali/800/450",
  },
  {
    id: "akshan",
    name: "Akshan",
    nameZh: "影哨",
    aliases: ["阿克尚", "akeshang"],
    avatarUrl: "/champions/akshan.png",
    splashUrl: "https://picsum.photos/seed/akshan/800/450",
  },
  {
    id: "brand",
    name: "Brand",
    nameZh: "复仇焰魂",
    aliases: ["火男", "布兰德", "bulande"],
    avatarUrl: "/champions/brand.png",
    splashUrl: "https://picsum.photos/seed/brand/800/450",
  },
  {
    id: "caitlyn",
    name: "Caitlyn",
    nameZh: "皮城女警",
    aliases: ["女警", "凯特琳", "kaitelin"],
    avatarUrl: "/champions/caitlyn.png",
    splashUrl: "https://picsum.photos/seed/caitlyn/800/450",
  },
  {
    id: "darius",
    name: "Darius",
    nameZh: "诺克萨斯之手",
    aliases: ["诺手", "德莱厄斯", "delaisi"],
    avatarUrl: "/champions/darius.png",
    splashUrl: "https://picsum.photos/seed/darius/800/450",
  },
  {
    id: "ezreal",
    name: "Ezreal",
    nameZh: "探险家",
    aliases: ["ez", "伊泽瑞尔", "yizeruier"],
    avatarUrl: "/champions/ezreal.png",
    splashUrl: "https://picsum.photos/seed/ezreal/800/450",
  },
  {
    id: "jinx",
    name: "Jinx",
    nameZh: "暴走萝莉",
    aliases: ["金克丝", "jinkesi"],
    avatarUrl: "/champions/jinx.png",
    splashUrl: "https://picsum.photos/seed/jinx/800/450",
  },
  {
    id: "kaisa",
    name: "Kai'Sa",
    nameZh: "虚空之女",
    aliases: ["卡莎", "kasha"],
    avatarUrl: "/champions/kaisa.png",
    splashUrl: "https://picsum.photos/seed/kaisa/800/450",
  },
  {
    id: "lux",
    name: "Lux",
    nameZh: "光辉女郎",
    aliases: ["光辉", "拉克丝", "laksi"],
    avatarUrl: "/champions/lux.png",
    splashUrl: "https://picsum.photos/seed/lux/800/450",
  },
  {
    id: "masteryi",
    name: "Master Yi",
    nameZh: "无极剑圣",
    aliases: ["剑圣", "易", "yidashi", "js"],
    avatarUrl: "/champions/masteryi.png",
    splashUrl: "https://picsum.photos/seed/masteryi/800/450",
  },
  {
    id: "missfortune",
    name: "Miss Fortune",
    nameZh: "赏金猎人",
    aliases: ["女枪", "好运姐", "mf", "shaer"],
    avatarUrl: "/champions/missfortune.png",
    splashUrl: "https://picsum.photos/seed/missfortune/800/450",
  },
  {
    id: "pyke",
    name: "Pyke",
    nameZh: "血港鬼影",
    aliases: ["派克", "paike"],
    avatarUrl: "/champions/pyke.png",
    splashUrl: "https://picsum.photos/seed/pyke/800/450",
  },
  {
    id: "sett",
    name: "Sett",
    nameZh: "腕豪",
    aliases: ["瑟提", "劲夫", "seti", "jinfu"],
    avatarUrl: "/champions/sett.png",
    splashUrl: "https://picsum.photos/seed/sett/800/450",
  },
  {
    id: "teemo",
    name: "Teemo",
    nameZh: "迅捷斥候",
    aliases: ["提莫", "timo"],
    avatarUrl: "/champions/teemo.png",
    splashUrl: "https://picsum.photos/seed/teemo/800/450",
  },
  {
    id: "thresh",
    name: "Thresh",
    nameZh: "魂锁典狱长",
    aliases: ["锤石", "chushi"],
    avatarUrl: "/champions/thresh.png",
    splashUrl: "https://picsum.photos/seed/thresh/800/450",
  },
  {
    id: "varus",
    name: "Varus",
    nameZh: "惩戒之箭",
    aliases: ["韦鲁斯", "weilusi"],
    avatarUrl: "/champions/varus.png",
    splashUrl: "https://picsum.photos/seed/varus/800/450",
  },
  {
    id: "yasuo",
    name: "Yasuo",
    nameZh: "疾风剑豪",
    aliases: ["亚索", "yasuo", "suozi", "hasaki"],
    avatarUrl: "/champions/yasuo.png",
    splashUrl: "https://picsum.photos/seed/yasuo/800/450",
  },
  {
    id: "zed",
    name: "Zed",
    nameZh: "影流之主",
    aliases: ["劫", "zed", "jie"],
    avatarUrl: "/champions/zed.png",
    splashUrl: "https://picsum.photos/seed/zed/800/450",
  },
  {
    id: "ziggs",
    name: "Ziggs",
    nameZh: "爆破鬼才",
    aliases: ["炸弹人", "吉格斯", "jigesi"],
    avatarUrl: "/champions/ziggs.png",
    splashUrl: "https://picsum.photos/seed/ziggs/800/450",
  },
  {
    id: "zyra",
    name: "Zyra",
    nameZh: "荆棘之兴",
    aliases: ["婕拉", "jiela"],
    avatarUrl: "/champions/zyra.png",
    splashUrl: "https://picsum.photos/seed/zyra/800/450",
  },
]

const augments: Augment[] = [
  {
    id: "back-to-basics",
    name: "Back to Basics",
    nameZh: "返璞归真",
    description: "Abilities deal less damage but basic attacks deal more.",
    iconUrl: "/augments/back-to-basics.png",
  },
  {
    id: "bread-and-cheese",
    name: "Bread and Cheese",
    nameZh: "面包与奶酪",
    description: "Gain bonus gold and heal periodically.",
    iconUrl: "/augments/bread-and-cheese.png",
  },
  {
    id: "can-t-touch-this",
    name: "Can't Touch This",
    nameZh: "不可触碰",
    description: "Gain bonus movement speed and tenacity.",
    iconUrl: "/augments/cant-touch-this.png",
  },
  {
    id: "celestial-body",
    name: "Celestial Body",
    nameZh: "星界躯体",
    description: "Gain max health but deal less damage early.",
    iconUrl: "/augments/celestial-body.png",
  },
  {
    id: "chain-lightning",
    name: "Chain Lightning",
    nameZh: "连锁闪电",
    description: "Basic attacks chain to nearby enemies.",
    iconUrl: "/augments/chain-lightning.png",
  },
  {
    id: "earthwake",
    name: "Earthwake",
    nameZh: "地动",
    description: "Periodically deal AoE damage around you.",
    iconUrl: "/augments/earthwake.png",
  },
  {
    id: "feel-the-burn",
    name: "Feel the Burn",
    nameZh: "燃烧之触",
    description: "Abilities apply a burn to enemies.",
    iconUrl: "/augments/feel-the-burn.png",
  },
  {
    id: "flashy",
    name: "Flashy",
    nameZh: "闪现专精",
    description: "Flash cooldown reduced. Gain movespeed after flashing.",
    iconUrl: "/augments/flashy.png",
  },
  {
    id: "giant-slayer",
    name: "Giant Slayer",
    nameZh: "巨人杀手",
    description: "Deal bonus damage to high-health enemies.",
    iconUrl: "/augments/giant-slayer.png",
  },
  {
    id: "ice-cold",
    name: "Ice Cold",
    nameZh: "冰冷触摸",
    description: "Abilities slow enemies on hit.",
    iconUrl: "/augments/ice-cold.png",
  },
  {
    id: "juice",
    name: "Juice",
    nameZh: "果汁",
    description: "Potions are more effective and grant bonus stats.",
    iconUrl: "/augments/juice.png",
  },
  {
    id: "laser-eyes",
    name: "Laser Eyes",
    nameZh: "激光眼",
    description: "Periodically fire a laser in target direction.",
    iconUrl: "/augments/laser-eyes.png",
  },
  {
    id: "mad-scientist",
    name: "Mad Scientist",
    nameZh: "疯狂科学家",
    description: "Abilities have bonus effects but cost more mana.",
    iconUrl: "/augments/mad-scientist.png",
  },
  {
    id: "phenomenal-evil",
    name: "Phenomenal Evil",
    nameZh: "超凡邪恶",
    description: "Gain permanent AP when hitting enemies with abilities.",
    iconUrl: "/augments/phenomenal-evil.png",
  },
  {
    id: "raid-boss",
    name: "Raid Boss",
    nameZh: "副本Boss",
    description: "Gain size, health, and resistances.",
    iconUrl: "/augments/raid-boss.png",
  },
  {
    id: "slow-cooker",
    name: "Slow Cooker",
    nameZh: "慢炖",
    description: "Deal increasing damage the longer you stay in combat.",
    iconUrl: "/augments/slow-cooker.png",
  },
  {
    id: "stats",
    name: "Stats!",
    nameZh: "属性暴涨",
    description: "Gain random bonus stats each round.",
    iconUrl: "/augments/stats.png",
  },
  {
    id: "the-egg",
    name: "The Egg",
    nameZh: "蛋",
    description: "Revive once with bonus stats.",
    iconUrl: "/augments/the-egg.png",
  },
  {
    id: "ultimate-revolution",
    name: "Ultimate Revolution",
    nameZh: "终极革命",
    description: "Ultimate cooldown greatly reduced.",
    iconUrl: "/augments/ultimate-revolution.png",
  },
  {
    id: "with-haste",
    name: "With Haste",
    nameZh: "急速",
    description: "Gain stacking attack speed in combat.",
    iconUrl: "/augments/with-haste.png",
  },
]

/* ── Helpers ── */

let _seed = 42
function pseudoRandom(): number {
  _seed = (_seed * 16807) % 2147483647
  return (_seed - 1) / 2147483646
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickChamp(id: string): Champion {
  return champions.find((c) => c.id === id) ?? champions[0]
}

/* ── MockDataService ── */

export const mockDataService: DataService = {
  async getPatchSummary() {
    return {
      version: "25.14",
      publishDate: "2026-07-09",
      totalSamples: 2_847_000,
      lastUpdated: new Date().toISOString(),
    }
  },

  async getTopChampions({ limit }) {
    return shuffle(champions)
      .slice(0, limit)
      .map((champion, i) => ({
        champion,
        winRate: 56.2 - i * 1.3 + pseudoRandom() * 2,
        pickRate: 18.5 - i * 1.8 + pseudoRandom() * 2,
        matches: Math.floor((50000 - i * 5000) * (0.8 + pseudoRandom() * 0.4)),
        confidence: i < 3 ? ("high" as const) : i < 6 ? ("medium" as const) : ("low" as const),
        rank: i + 1,
      }))
  },

  async getTrendingChampions() {
    const pool = shuffle(champions).slice(0, 10)
    return {
      up: pool.slice(0, 5).map((champion) => ({
        champion,
        winRateChange: +(pseudoRandom() * 4 + 0.5).toFixed(1),
        currentWinRate: +(50 + pseudoRandom() * 8).toFixed(1),
      })),
      down: pool.slice(5, 10).map((champion) => ({
        champion,
        winRateChange: -(pseudoRandom() * 4 + 0.3).toFixed(1),
        currentWinRate: +(45 + pseudoRandom() * 5).toFixed(1),
      })),
    }
  },

  async getTopAugments({ limit }) {
    return shuffle(augments)
      .slice(0, limit)
      .map((augment) => ({
        augment,
        winRate: 54 + pseudoRandom() * 6,
        matches: Math.floor(30000 * (0.6 + pseudoRandom() * 0.8)),
        suitableChampions: shuffle(champions).slice(0, 4),
      }))
  },

  async searchChampions({ query }) {
    const q = query.toLowerCase()
    const results = champions
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.nameZh.includes(q) || c.aliases.some((a) => a.toLowerCase().includes(q))
      )
      .map((champion) => ({
        champion,
        winRate: +(48 + pseudoRandom() * 10).toFixed(1),
        matches: Math.floor(20000 * (0.5 + pseudoRandom())),
        confidence: (pseudoRandom() > 0.6 ? "high" : pseudoRandom() > 0.3 ? "medium" : "low") as
          | "high"
          | "medium"
          | "low",
      }))
    return results
  },

  async getChampionDetail({ id }) {
    const champion = pickChamp(id)
    return {
      champion,
      winRate: +(50 + pseudoRandom() * 8).toFixed(1),
      pickRate: +(8 + pseudoRandom() * 14).toFixed(1),
      matches: Math.floor(40000 * (0.6 + pseudoRandom() * 0.8)),
      confidence: (pseudoRandom() > 0.5 ? "high" : "medium") as "high" | "medium",
      build: {
        skillOrder: ["Q", "E", "W", "Q", "Q", "R", "Q", "E", "Q", "E", "R", "E", "E", "W", "W", "R", "W", "W"],
        coreItems: [
          { name: "Luden's Tempest", iconUrl: "/items/ludens.png" },
          { name: "Sorcerer's Shoes", iconUrl: "/items/sorcs.png" },
          { name: "Shadowflame", iconUrl: "/items/shadowflame.png" },
          { name: "Rabadon's Deathcap", iconUrl: "/items/deathcap.png" },
        ],
        runes: { primaryPath: "Domination", secondaryPath: "Sorcery", keystone: "Electrocute" },
      },
      topAugmentCombos: shuffle(augments)
        .slice(0, 5)
        .map((augment) => ({
          augment,
          synergyScore: +(60 + pseudoRandom() * 30).toFixed(1),
          matches: Math.floor(5000 * (0.5 + pseudoRandom())),
        })),
      trendData: [
        { patch: "25.10", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.11", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.12", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.13", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.14", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
      ],
    }
  },

  async getAugmentDetail({ id }) {
    const augment = augments.find((a) => a.id === id) ?? augments[0]
    return {
      augment,
      winRate: +(52 + pseudoRandom() * 8).toFixed(1),
      pickRate: +(5 + pseudoRandom() * 12).toFixed(1),
      matches: Math.floor(25000 * (0.5 + pseudoRandom())),
      confidence: (pseudoRandom() > 0.5 ? "high" : "medium") as "high" | "medium",
      suitableChampions: shuffle(champions).slice(0, 6).map((champion) => ({
        champion,
        synergyScore: +(50 + pseudoRandom() * 40).toFixed(1),
      })),
      trendData: [
        { patch: "25.10", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.11", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.12", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.13", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
        { patch: "25.14", winRate: +(50 + pseudoRandom() * 6).toFixed(1) },
      ],
    }
  },

  async getAtlasPreview() {
    const nodes = [
      ...shuffle(champions)
        .slice(0, 12)
        .map((c, i) => ({
          id: c.id,
          name: c.nameZh,
          type: "champion" as const,
          x: 10 + (i % 4) * 26,
          y: 10 + Math.floor(i / 4) * 30,
          size: 3 + pseudoRandom() * 4,
        })),
      ...shuffle(augments)
        .slice(0, 8)
        .map((a, i) => ({
          id: a.id,
          name: a.nameZh,
          type: "augment" as const,
          x: 20 + (i % 4) * 20,
          y: 18 + Math.floor(i / 4) * 28,
          size: 2 + pseudoRandom() * 3,
        })),
    ]
    const championNodes = nodes.filter((n) => n.type === "champion")
    const augmentNodes = nodes.filter((n) => n.type === "augment")
    const links = []
    for (let i = 0; i < 20; i++) {
      const source = championNodes[Math.floor(pseudoRandom() * championNodes.length)]
      const target = augmentNodes[Math.floor(pseudoRandom() * augmentNodes.length)]
      links.push({ source: source.id, target: target.id, strength: +(0.3 + pseudoRandom() * 0.7).toFixed(2) })
    }
    return { nodes, links }
  },
}

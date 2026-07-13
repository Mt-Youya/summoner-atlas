import en from "./locales/en/common.json"
import ko from "./locales/ko/common.json"
import zh from "./locales/zh/common.json"

export const locales = ["zh", "en", "ko"] as const
export type Locale = (typeof locales)[number]
export const localeLabels: Record<Locale, string> = { zh: "中文", en: "English", ko: "한국어" }

const messages = { zh, en, ko } as const
export type MessageKey = keyof typeof zh

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function t(locale: Locale, key: MessageKey) {
  return messages[locale][key]
}

export function localizePath(path: string, locale: Locale) {
  return path.replace(/^\/(zh|en|ko)(?=\/|$)/, `/${locale}`)
}

const copy: Partial<Record<Locale, Record<string, string>>> = {
  en: {
    用数据选英雄: "Choose champions with data",
    找出值得拿的海克斯: "Find augments worth taking",
    "先选英雄，再看可行组合": "Choose a champion, then study combinations",
    在同一版本比较选择: "Compare choices on the same patch",
    结论必须能被追溯: "Every conclusion should be traceable",
    账户偏好与绑定: "Account preferences and connections",
    登录与绑定: "Sign in and link accounts",
    数据来源与使用说明: "Data sources and usage notice",
    维护入口: "Maintenance entry",
  },
  ko: {
    用数据选英雄: "데이터로 챔피언 선택하기",
    找出值得拿的海克斯: "선택할 가치가 있는 증강 찾기",
    "先选英雄，再看可行组合": "챔피언을 고르고 조합을 살펴보세요",
    在同一版本比较选择: "같은 패치에서 선택 비교하기",
    结论必须能被追溯: "모든 결론은 추적 가능해야 합니다",
    账户偏好与绑定: "계정 환경설정 및 연동",
    登录与绑定: "로그인 및 계정 연동",
    数据来源与使用说明: "데이터 출처 및 이용 안내",
    维护入口: "관리 입구",
  },
}

export function translateCopy(locale: Locale, value: string) {
  return copy[locale]?.[value] ?? value
}

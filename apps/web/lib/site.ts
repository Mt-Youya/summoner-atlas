export const siteUrl = new URL("https://summoner-atlas.yonjay.me")

export function canonical(path: string) {
  return new URL(path, siteUrl).toString()
}

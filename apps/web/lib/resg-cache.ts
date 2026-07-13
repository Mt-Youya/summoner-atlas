import { supabase } from "@/lib/supabase-server"

const tableName = "resg_cache"
const CACHE_VERSION = "v2"

export async function withResgCache<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
  const versionedKey = `${CACHE_VERSION}:${key}`
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("payload")
        .eq("cache_key", versionedKey)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle()

      if (!error && data) return data.payload as T
    } catch {
      // Supabase 不可用时继续请求上游，避免缓存成为单点故障。
    }
  }

  const value = await load()

  if (supabase) {
    try {
      await supabase.from(tableName).upsert({
        cache_key: versionedKey,
        payload: value,
        expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch {
      // 写入失败不影响本次数据响应。
    }
  }

  return value
}

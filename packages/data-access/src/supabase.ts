import { createClient } from "@supabase/supabase-js"

try {
  process.loadEnvFile(".env")
} catch {
  /* Next.js already provides env */
}

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.SUMMONER_ATLAS_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUMMONER_ATLAS_SUPABASE_SUMMONER_ATLAS_SUPABASE_URL

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SECRET_KEY

export const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null

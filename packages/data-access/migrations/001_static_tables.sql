-- Static reference data tables (multi-language)
-- Run this in Supabase SQL Editor before running pnpm sync

CREATE TABLE IF NOT EXISTS static_champions (
  id BIGINT PRIMARY KEY,
  name_zh TEXT,
  name_en TEXT,
  name_ko TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ko TEXT,
  alias TEXT NOT NULL,
  image_url TEXT,
  roles TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS static_items (
  id BIGINT PRIMARY KEY,
  name_zh TEXT,
  name_en TEXT,
  name_ko TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ko TEXT,
  icon_url TEXT,
  price INTEGER,
  price_total INTEGER,
  categories TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS static_augments (
  id BIGINT PRIMARY KEY,
  name_zh TEXT,
  name_en TEXT,
  name_ko TEXT,
  icon_url TEXT,
  rarity TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS static_summoner_spells (
  id BIGINT PRIMARY KEY,
  name_zh TEXT,
  name_en TEXT,
  name_ko TEXT,
  description_zh TEXT,
  description_en TEXT,
  description_ko TEXT,
  icon_url TEXT,
  cooldown INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_versions (
  version TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

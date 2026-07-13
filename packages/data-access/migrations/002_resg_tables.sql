-- Dynamic resg.top stats tables

CREATE TABLE IF NOT EXISTS resg_champion_stats (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  champion_id INTEGER NOT NULL,
  total_matches INTEGER,
  avg_win_rate DECIMAL(5,4),
  UNIQUE(version, champion_id)
);

CREATE TABLE IF NOT EXISTS resg_augments (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  augment_id INTEGER NOT NULL,
  display_name TEXT,
  description TEXT,
  tooltip TEXT,
  UNIQUE(version, augment_id)
);

CREATE TABLE IF NOT EXISTS resg_items (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  name TEXT,
  description TEXT,
  UNIQUE(version, item_id)
);

CREATE TABLE IF NOT EXISTS resg_synergy (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  champion_id INTEGER NOT NULL,
  combo_type TEXT,
  combo_key TEXT,
  total_matches INTEGER,
  win_rate DECIMAL(5,4),
  builds JSONB,
  UNIQUE(version, champion_id, combo_key)
);

CREATE TABLE IF NOT EXISTS resg_base_stats (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  champion_id INTEGER NOT NULL,
  spells INTEGER[],
  boots_id INTEGER,
  max_order TEXT,
  total_matches INTEGER,
  win_rate DECIMAL(5,4),
  UNIQUE(version, champion_id, spells, boots_id)
);

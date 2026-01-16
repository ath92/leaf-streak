CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,  -- YYYY-MM-DD
  points REAL NOT NULL,       -- 1.0, 0.5, or 0.25
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_entries_date ON entries(date);

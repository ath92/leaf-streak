-- Create new table with streak_id
CREATE TABLE new_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  streak_id TEXT NOT NULL DEFAULT 'default',
  date TEXT NOT NULL,
  points REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(streak_id, date)
);

-- Copy existing data
INSERT INTO new_entries (id, date, points, created_at)
SELECT id, date, points, created_at FROM entries;

-- Drop old table and rename new one
DROP TABLE entries;
ALTER TABLE new_entries RENAME TO entries;

-- Create index
CREATE INDEX idx_entries_streak_date ON entries(streak_id, date);

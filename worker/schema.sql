CREATE TABLE IF NOT EXISTS devices (
    machine_id       TEXT PRIMARY KEY,
    machine_name     TEXT NOT NULL,
    bark_key         TEXT,
    notify_token     TEXT NOT NULL,
    is_active        INTEGER NOT NULL DEFAULT 1,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
    last_notified_at TEXT
);

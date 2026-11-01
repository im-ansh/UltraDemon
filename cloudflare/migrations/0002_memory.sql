-- UltraMemory Sovereign Memory & Knowledge Engine Schema
-- High-speed structured long-term memory for AI agents
-- Powered by SQLite FTS5 BM25 at the Cloudflare Edge

CREATE TABLE IF NOT EXISTS memories (
  memory_id      TEXT    PRIMARY KEY,
  user_id        TEXT    NOT NULL,
  container_tag  TEXT    NOT NULL DEFAULT 'default',
  session_id     TEXT    NOT NULL DEFAULT '',
  memory_type    TEXT    NOT NULL DEFAULT 'fact', -- fact, preference, entity, document, file, conversation
  title          TEXT    NOT NULL DEFAULT '',
  content        TEXT    NOT NULL,
  metadata_json  TEXT    NOT NULL DEFAULT '{}',
  file_name      TEXT,
  file_type      TEXT,
  file_size      INTEGER NOT NULL DEFAULT 0,
  chunk_index    INTEGER NOT NULL DEFAULT 0,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mem_user_container ON memories(user_id, container_tag);
CREATE INDEX IF NOT EXISTS idx_mem_user_type      ON memories(user_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_mem_created        ON memories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mem_session        ON memories(user_id, session_id);

-- Full-Text Search Virtual Table for Memory Retrieval via BM25
CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
  title,
  content,
  metadata_json,
  content='memories',
  content_rowid='rowid',
  tokenize='porter unicode61'
);

-- Triggers to keep FTS5 synchronized with memories table
CREATE TRIGGER IF NOT EXISTS mem_ai AFTER INSERT ON memories BEGIN
  INSERT INTO memories_fts(rowid, title, content, metadata_json)
  VALUES (new.rowid, new.title, new.content, new.metadata_json);
END;

CREATE TRIGGER IF NOT EXISTS mem_ad AFTER DELETE ON memories BEGIN
  INSERT INTO memories_fts(memories_fts, rowid, title, content, metadata_json)
  VALUES ('delete', old.rowid, old.title, old.content, old.metadata_json);
END;

CREATE TRIGGER IF NOT EXISTS mem_au AFTER UPDATE ON memories BEGIN
  INSERT INTO memories_fts(memories_fts, rowid, title, content, metadata_json)
  VALUES ('delete', old.rowid, old.title, old.content, old.metadata_json);
  INSERT INTO memories_fts(rowid, title, content, metadata_json)
  VALUES (new.rowid, new.title, new.content, new.metadata_json);
END;


from __future__ import annotations

import sqlite3
from datetime import datetime, timezone

from server.chunks import text_hash
from server.config import Settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  published_on TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS entry_tags (
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);
CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_hash TEXT NOT NULL,
  vector BLOB,
  model TEXT,
  UNIQUE (entry_id, ordinal)
);
CREATE TABLE IF NOT EXISTS embed_jobs (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);
"""


def utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def connect(settings: Settings) -> sqlite3.Connection:
    settings.db_file.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(settings.db_file)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(settings: Settings) -> None:
    with connect(settings) as conn:
        conn.executescript(SCHEMA)


def _tags_for(conn: sqlite3.Connection, entry_id: int) -> list[str]:
    rows = conn.execute(
        """
        SELECT tags.name FROM tags
        JOIN entry_tags ON entry_tags.tag_id = tags.id
        WHERE entry_tags.entry_id = ?
        ORDER BY tags.name COLLATE NOCASE
        """,
        (entry_id,),
    ).fetchall()
    return [row["name"] for row in rows]


def _entry_dict(conn: sqlite3.Connection, row: sqlite3.Row) -> dict:
    pending = conn.execute(
        "SELECT COUNT(*) AS n FROM chunks WHERE entry_id = ? AND vector IS NULL",
        (row["id"],),
    ).fetchone()["n"]
    ready = conn.execute(
        "SELECT COUNT(*) AS n FROM chunks WHERE entry_id = ? AND vector IS NOT NULL",
        (row["id"],),
    ).fetchone()["n"]
    return {
        "id": row["slug"],
        "slug": row["slug"],
        "title": row["title"],
        "abstract": row["abstract"],
        "content": row["content"],
        "date": row["published_on"],
        "tags": _tags_for(conn, row["id"]),
        "embed_ready": ready,
        "embed_pending": pending,
    }


def list_entries(settings: Settings, tag: str | None, oldest_first: bool) -> list[dict]:
    order = "ASC" if oldest_first else "DESC"
    sql = f"""
        SELECT entries.* FROM entries
        {"JOIN entry_tags ON entry_tags.entry_id = entries.id JOIN tags ON tags.id = entry_tags.tag_id AND tags.name = ?" if tag else ""}
        ORDER BY entries.published_on {order}, entries.slug ASC
    """
    args: tuple = (tag,) if tag else ()
    with connect(settings) as conn:
        rows = conn.execute(sql, args).fetchall()
        return [_entry_dict(conn, row) for row in rows]


def get_entry(settings: Settings, slug: str) -> dict | None:
    with connect(settings) as conn:
        row = conn.execute("SELECT * FROM entries WHERE slug = ?", (slug,)).fetchone()
        if row is None:
            return None
        return _entry_dict(conn, row)


def list_tags(settings: Settings) -> list[dict]:
    with connect(settings) as conn:
        rows = conn.execute(
            """
            SELECT tags.name, COUNT(entry_tags.entry_id) AS n
            FROM tags
            LEFT JOIN entry_tags ON entry_tags.tag_id = tags.id
            GROUP BY tags.id
            ORDER BY n DESC, tags.name COLLATE NOCASE
            """
        ).fetchall()
    return [{"name": row["name"], "count": row["n"]} for row in rows]


def _set_tags(conn: sqlite3.Connection, entry_id: int, names: list[str]) -> None:
    conn.execute("DELETE FROM entry_tags WHERE entry_id = ?", (entry_id,))
    seen: set[str] = set()
    for raw in names:
        name = raw.strip()
        if not name or name.casefold() in seen:
            continue
        seen.add(name.casefold())
        found = conn.execute(
            "SELECT id FROM tags WHERE name = ? COLLATE NOCASE", (name,)
        ).fetchone()
        if found is None:
            conn.execute("INSERT INTO tags (name) VALUES (?)", (name,))
            found = conn.execute("SELECT last_insert_rowid() AS id").fetchone()
        conn.execute(
            "INSERT INTO entry_tags (entry_id, tag_id) VALUES (?, ?)",
            (entry_id, found["id"]),
        )


def sync_chunks(conn: sqlite3.Connection, entry_id: int, pieces: list[str]) -> bool:
    old = conn.execute(
        "SELECT text_hash, vector, model FROM chunks WHERE entry_id = ?",
        (entry_id,),
    ).fetchall()
    by_hash: dict[str, sqlite3.Row] = {}
    for row in old:
        by_hash.setdefault(row["text_hash"], row)
    conn.execute("DELETE FROM chunks WHERE entry_id = ?", (entry_id,))
    pending = False
    for ordinal, text in enumerate(pieces):
        digest = text_hash(text)
        prev = by_hash.get(digest)
        vector = prev["vector"] if prev is not None else None
        model = prev["model"] if prev is not None else None
        if vector is None:
            pending = True
        conn.execute(
            """
            INSERT INTO chunks (entry_id, ordinal, text, text_hash, vector, model)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (entry_id, ordinal, text, digest, vector, model),
        )
    return pending


def enqueue(conn: sqlite3.Connection, entry_id: int) -> None:
    conn.execute(
        "INSERT INTO embed_jobs (entry_id, created_at) VALUES (?, ?)",
        (entry_id, utc_now()),
    )


def save_entry(settings: Settings, data: dict, pieces: list[str]) -> dict:
    now = utc_now()
    with connect(settings) as conn:
        existing = conn.execute(
            "SELECT id FROM entries WHERE slug = ?", (data["slug"],)
        ).fetchone()
        if existing is None:
            conn.execute(
                """
                INSERT INTO entries (slug, title, abstract, content, published_on, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    data["slug"],
                    data["title"],
                    data["abstract"],
                    data["content"],
                    data["date"],
                    now,
                    now,
                ),
            )
            entry_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
        else:
            entry_id = existing["id"]
            conn.execute(
                """
                UPDATE entries
                SET title = ?, abstract = ?, content = ?, published_on = ?, updated_at = ?
                WHERE id = ?
                """,
                (data["title"], data["abstract"], data["content"], data["date"], now, entry_id),
            )
        if data.get("replace_tags", True):
            _set_tags(conn, entry_id, data.get("tags") or [])
        if sync_chunks(conn, entry_id, pieces):
            enqueue(conn, entry_id)
        conn.commit()
    found = get_entry(settings, data["slug"])
    if found is None:
        raise RuntimeError("La entrada no quedó guardada")
    return found


def delete_entry(settings: Settings, slug: str) -> bool:
    with connect(settings) as conn:
        cur = conn.execute("DELETE FROM entries WHERE slug = ?", (slug,))
        conn.commit()
        return cur.rowcount > 0


def next_job(settings: Settings) -> int | None:
    with connect(settings) as conn:
        row = conn.execute(
            "SELECT entry_id FROM embed_jobs ORDER BY id ASC LIMIT 1"
        ).fetchone()
    return None if row is None else int(row["entry_id"])


def pending_chunk_texts(settings: Settings, entry_id: int) -> list[tuple[int, str]]:
    with connect(settings) as conn:
        rows = conn.execute(
            """
            SELECT ordinal, text FROM chunks
            WHERE entry_id = ? AND vector IS NULL
            ORDER BY ordinal
            """,
            (entry_id,),
        ).fetchall()
    return [(int(row["ordinal"]), row["text"]) for row in rows]


def store_vectors(settings: Settings, entry_id: int, model: str, pairs: list[tuple[int, bytes]]) -> None:
    with connect(settings) as conn:
        for ordinal, blob in pairs:
            conn.execute(
                """
                UPDATE chunks SET vector = ?, model = ?
                WHERE entry_id = ? AND ordinal = ?
                """,
                (blob, model, entry_id, ordinal),
            )
        left = conn.execute(
            "SELECT COUNT(*) AS n FROM chunks WHERE entry_id = ? AND vector IS NULL",
            (entry_id,),
        ).fetchone()["n"]
        if left == 0:
            conn.execute("DELETE FROM embed_jobs WHERE entry_id = ?", (entry_id,))
        conn.commit()


def finish_job_if_idle(settings: Settings, entry_id: int) -> None:
    with connect(settings) as conn:
        left = conn.execute(
            "SELECT COUNT(*) AS n FROM chunks WHERE entry_id = ? AND vector IS NULL",
            (entry_id,),
        ).fetchone()["n"]
        if left == 0:
            conn.execute("DELETE FROM embed_jobs WHERE entry_id = ?", (entry_id,))
            conn.commit()


def vectors_by_entry(settings: Settings) -> list[tuple[str, bytes]]:
    with connect(settings) as conn:
        rows = conn.execute(
            """
            SELECT entries.slug, chunks.vector
            FROM chunks
            JOIN entries ON entries.id = chunks.entry_id
            WHERE chunks.vector IS NOT NULL
            """
        ).fetchall()
    return [(row["slug"], row["vector"]) for row in rows]

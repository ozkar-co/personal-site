from __future__ import annotations

import asyncio
import json
import logging
import struct
import urllib.error
import urllib.request

from server import db
from server.config import Settings

log = logging.getLogger("blog.embed")
BATCH = 16


def pack_vector(values: list[float]) -> bytes:
    return struct.pack(f"<{len(values)}f", *values)


def unpack_vector(blob: bytes) -> list[float]:
    count = len(blob) // 4
    return list(struct.unpack(f"<{count}f", blob))


def _post_embed(settings: Settings, texts: list[str]) -> tuple[str, list[list[float]]]:
    payload = json.dumps({"texts": texts}).encode()
    request = urllib.request.Request(
        f"{settings.embed_url}/api/embed",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        body = json.loads(response.read().decode())
    if not body.get("success"):
        raise RuntimeError(body.get("message") or "embed rechazó el lote")
    vectors = body.get("embeddings")
    if not isinstance(vectors, list) or len(vectors) != len(texts):
        raise RuntimeError("embed devolvió un lote distinto")
    model = str(body.get("model") or "")
    if not model:
        raise RuntimeError("embed no dijo qué modelo usó")
    return model, vectors


def process_entry(settings: Settings, entry_id: int) -> None:
    pending = db.pending_chunk_texts(settings, entry_id)
    if not pending:
        db.finish_job_if_idle(settings, entry_id)
        return
    for start in range(0, len(pending), BATCH):
        batch = pending[start : start + BATCH]
        model, vectors = _post_embed(settings, [text for _, text in batch])
        pairs = [
            (ordinal, pack_vector([float(n) for n in vector]))
            for (ordinal, _), vector in zip(batch, vectors)
        ]
        db.store_vectors(settings, entry_id, model, pairs)
        log.info("entry %s: %s trozos", entry_id, len(pairs))


async def embed_loop(settings: Settings) -> None:
    while True:
        try:
            entry_id = await asyncio.to_thread(db.next_job, settings)
            if entry_id is None:
                await asyncio.sleep(5)
                continue
            await asyncio.to_thread(process_entry, settings, entry_id)
        except asyncio.CancelledError:
            raise
        except (urllib.error.URLError, TimeoutError, RuntimeError, OSError) as exc:
            log.warning("cola embed: %s", exc)
            await asyncio.sleep(30)
        except Exception:
            log.exception("cola embed")
            await asyncio.sleep(30)

"""Trae las entradas de legacy-api. No copia etiquetas."""

import json
import urllib.request

from server import db
from server.chunks import body_chunks
from server.config import load_settings

LEGACY = "https://legacy-api.forja.cc/ozkar/blog"


def _date(raw: object) -> str:
    from datetime import datetime, timezone

    if isinstance(raw, str) and len(raw) >= 10 and raw[4] == "-" and raw[7] == "-":
        return raw[:10]
    if isinstance(raw, (int, float)):
        return datetime.fromtimestamp(raw / 1000 if raw > 10_000_000_000 else raw, timezone.utc).date().isoformat()
    if isinstance(raw, dict) and "$date" in raw:
        millis = int(raw["$date"]["$numberLong"])
        return datetime.fromtimestamp(millis / 1000, timezone.utc).date().isoformat()
    raise RuntimeError(f"Fecha no reconocida: {raw!r}")


def main() -> None:
    settings = load_settings()
    db.init_db(settings)
    with urllib.request.urlopen(LEGACY, timeout=60) as response:
        rows = json.loads(response.read().decode())
    if not isinstance(rows, list) or not rows:
        raise RuntimeError("La API vieja no devolvió entradas")
    for row in rows:
        slug = str(row["slug"])
        data = {
            "slug": slug,
            "title": str(row.get("title") or slug),
            "abstract": str(row.get("abstract") or ""),
            "content": str(row.get("content") or ""),
            "date": _date(row.get("date")),
            "tags": [],
            "replace_tags": False,
        }
        pieces = body_chunks(data["title"], data["abstract"], data["content"])
        db.save_entry(settings, data, pieces)
        print(slug)
    print(f"{len(rows)} entradas. Etiquetas no importadas. Embed en cola.")


if __name__ == "__main__":
    main()

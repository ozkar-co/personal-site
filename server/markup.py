from __future__ import annotations

import html
import re

# Bloque ya armado como las entradas viejas: <p>, títulos, lista, cita.
_BLOCK = re.compile(r"<\s*(?:p|h2|h3|ul|blockquote|div)\b", re.I)


def entry_html(source: str) -> str:
    """Texto plano → <p>…</p>. HTML de bloque se deja igual."""
    text = (source or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    if not text:
        return ""
    if _BLOCK.search(text):
        return text
    parts: list[str] = []
    for block in re.split(r"\n{2,}", text):
        block = block.strip()
        if not block:
            continue
        lines = [html.escape(line, quote=False) for line in block.split("\n")]
        parts.append("<p>" + "<br>".join(lines) + "</p>")
    return "".join(parts)

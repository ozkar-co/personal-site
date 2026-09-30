from __future__ import annotations

import hashlib
import html
import re

MAX_CHUNK = 2000

_BLOCK = re.compile(r"</p>|<br\s*/?>|</div>|</h[1-6]>", re.I)
_TAGS = re.compile(r"<[^>]+>")
_SENTENCE = re.compile(r"(?<=[.!?])\s+")


def html_to_text(source: str) -> str:
    text = _BLOCK.sub("\n\n", source or "")
    text = _TAGS.sub("", text)
    text = html.unescape(text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text.strip()


def _split_long(paragraph: str) -> list[str]:
    if len(paragraph) <= MAX_CHUNK:
        return [paragraph]
    parts = [p.strip() for p in _SENTENCE.split(paragraph) if p.strip()]
    if len(parts) <= 1:
        return _hard_split(paragraph)
    chunks: list[str] = []
    buf = ""
    for part in parts:
        if len(part) > MAX_CHUNK:
            if buf:
                chunks.append(buf)
                buf = ""
            chunks.extend(_hard_split(part))
            continue
        if buf and len(buf) + 1 + len(part) > MAX_CHUNK:
            chunks.append(buf)
            buf = part
        else:
            buf = f"{buf} {part}".strip()
    if buf:
        chunks.append(buf)
    return chunks


def _hard_split(text: str) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    buf = ""
    for word in words:
        if buf and len(buf) + 1 + len(word) > MAX_CHUNK:
            chunks.append(buf)
            buf = word
        else:
            buf = f"{buf} {word}".strip()
    if buf:
        chunks.append(buf)
    return chunks or [text[:MAX_CHUNK]]


def body_chunks(title: str, abstract: str, content: str) -> list[str]:
    pieces: list[str] = []
    head = html_to_text(f"{title}\n\n{abstract}").strip()
    if head:
        pieces.append(head)
    body = html_to_text(content)
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    for paragraph in paragraphs:
        pieces.extend(_split_long(paragraph))
    return pieces


def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

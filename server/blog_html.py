import html
from urllib.parse import quote

MONTHS = (
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
)


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def human_date(iso: str) -> str:
    year, month, day = iso.split("-")
    return f"{int(day)} de {MONTHS[int(month) - 1]} de {year}"


def page(title: str, description: str, canonical: str, site_url: str, body: str) -> str:
    rss = f"{site_url}/rss.xml"
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="canonical" href="{esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="Ozkar" href="{esc(rss)}">
<link rel="stylesheet" href="/blog/estilos.css">
</head>
<body>
<header class="top"><a href="/">Ozkar.co</a><nav>
<a href="/">OZ</a>
<a href="/cv">CV</a>
<a href="/blog" aria-current="page">BLOG</a>
<a href="/projects">PROY</a>
<a href="/wizz">WIZZ</a>
<a href="/time">TIME</a>
<a href="/clock">CLOCK</a>
<a href="/calc">CALC</a>
<a href="/rss.xml">RSS</a>
</nav></header>
<main class="wrap">
{body}
</main>
</body>
</html>
"""


def _cloud(tags: list[dict], current: str) -> str:
    if not tags:
        return '<p class="empty">Aún no hay etiquetas.</p>'
    max_count = max(item["count"] for item in tags) or 1
    links = []
    for item in tags:
        weight = max(1, round((item["count"] / max_count) * 5))
        href = "/blog?tag=" + quote(item["name"])
        mark = ' class="is-on"' if item["name"] == current else ""
        links.append(
            f'<a href="{href}"{mark} style="--w:{weight}">{esc(item["name"])}</a>'
        )
    return '<nav class="tag-cloud" aria-label="Etiquetas">' + "".join(links) + "</nav>"


def _cards(entries: list[dict]) -> str:
    if not entries:
        return '<p class="empty">Ninguna entrada.</p>'
    items = []
    for entry in entries:
        items.append(
            "<li><article>"
            f'<h2><a href="/blog/{esc(entry["slug"])}">{esc(entry["title"])}</a></h2>'
            f'<time datetime="{esc(entry["date"])}">{human_date(entry["date"])}</time>'
            f'<div class="abstract">{entry["abstract"]}</div>'
            "</article></li>"
        )
    return '<ol class="entries">' + "\n".join(items) + "</ol>"


def list_page(entries: list[dict], tags: list[dict], site_url: str, tag: str, oldest: bool) -> str:
    recent = "" if oldest else ' aria-current="true"'
    old = ' aria-current="true"' if oldest else ""
    tag_q = f"&tag={quote(tag)}" if tag else ""
    body = f"""
<h1>Blog</h1>
<div class="layout">
<div>
<form class="tools" action="/blog/buscar" method="get">
<label class="search">Buscar
<input type="search" name="q" placeholder="Una frase, no una palabra suelta"></label>
<p class="sort"><a href="/blog?orden=desc{tag_q}"{recent}>Más recientes</a>
<a href="/blog?orden=asc{tag_q}"{old}>Más antiguas</a></p>
</form>
{_cards(entries)}
</div>
{_cloud(tags, tag)}
</div>
"""
    return page("Blog — Ozkar", "Entradas del blog de Ozkar.", f"{site_url}/blog", site_url, body)


def entry_page(entry: dict, site_url: str) -> str:
    tags = "".join(
        f'<a href="/blog?tag={quote(name)}">#{esc(name)}</a>' for name in entry["tags"]
    )
    body = f"""
<a class="back" href="/blog">← Blog</a>
<article>
<h1>{esc(entry["title"])}</h1>
<time datetime="{esc(entry["date"])}">{human_date(entry["date"])}</time>
<div class="entry-body">{entry["content"]}</div>
<footer class="tags">{tags}</footer>
</article>
"""
    plain = html_to_plain(entry["abstract"]) or entry["title"]
    return page(
        f'{entry["title"]} — Ozkar',
        plain[:180],
        f'{site_url}/blog/{entry["slug"]}',
        site_url,
        body,
    )


def search_page(query: str, entries: list[dict], site_url: str, message: str) -> str:
    note = f'<p class="empty">{esc(message)}</p>' if message else ""
    body = f"""
<a class="back" href="/blog">← Blog</a>
<h1>Búsqueda</h1>
<form class="tools" action="/blog/buscar" method="get">
<label class="search">Buscar
<input type="search" name="q" value="{esc(query)}"></label>
</form>
{note}
{_cards(entries)}
"""
    return page(
        "Búsqueda — Ozkar",
        "Búsqueda del blog por significado.",
        f"{site_url}/blog/buscar",
        site_url,
        body,
    )


def html_to_plain(source: str) -> str:
    import re

    text = re.sub(r"<[^>]+>", " ", source or "")
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def rss(entries: list[dict], site_url: str) -> str:
    from datetime import datetime, timezone
    from email.utils import format_datetime

    items = []
    for entry in entries:
        year, month, day = entry["date"].split("-")
        published = datetime(int(year), int(month), int(day), 12, tzinfo=timezone.utc)
        link = f'{site_url}/blog/{entry["slug"]}'
        abstract = entry["abstract"].replace("]]>", "]]]]><![CDATA[>")
        items.append(
            "<item>"
            f"<title>{esc(entry['title'])}</title>"
            f"<link>{esc(link)}</link>"
            f'<guid isPermaLink="true">{esc(link)}</guid>'
            f"<pubDate>{format_datetime(published)}</pubDate>"
            f"<description><![CDATA[{abstract}]]></description>"
            "</item>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        "<rss version=\"2.0\"><channel>"
        "<title>Ozkar</title>"
        f"<link>{esc(site_url)}/blog</link>"
        "<description>Blog de Ozkar</description>"
        "<language>es</language>"
        + "".join(items)
        + "</channel></rss>\n"
    )

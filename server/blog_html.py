import html
from urllib.parse import quote

from server.html import esc, layout

MONTHS = (
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
)


def human_date(iso: str) -> str:
    year, month, day = iso.split("-")
    return f"{int(day)} de {MONTHS[int(month) - 1]} de {year}"


def _categories(tags: list[dict], current: str, total: int, oldest: bool) -> str:
    orden = "&orden=asc" if oldest else ""
    todas_href = "/blog?orden=asc" if oldest else "/blog"
    todas_on = "" if current else ' aria-current="true"'
    items = [f'<li><a href="{todas_href}"{todas_on}>Todas ({total})</a></li>']
    for item in sorted(tags, key=lambda row: row["name"].casefold()):
        href = "/blog?tag=" + quote(item["name"]) + orden
        mark = ' aria-current="true"' if item["name"] == current else ""
        items.append(
            f'<li><a href="{href}"{mark}>{esc(item["name"])} ({item["count"]})</a></li>'
        )
    return '<nav aria-label="Categorías"><ul class="cats">' + "".join(items) + "</ul></nav>"


def _cards(entries: list[dict]) -> str:
    if not entries:
        return '<p class="empty">Ninguna entrada.</p>'
    items = []
    for entry in entries:
        items.append(
            "<li><article>"
            f'<time datetime="{esc(entry["date"])}">{human_date(entry["date"])}</time>'
            f'<h2><a href="/blog/{esc(entry["slug"])}">{esc(entry["title"])}</a></h2>'
            f'<div class="abstract">{entry["abstract"]}</div>'
            "</article></li>"
        )
    return '<ol class="entries">' + "\n".join(items) + "</ol>"


def list_page(entries: list[dict], tags: list[dict], site_url: str, tag: str, oldest: bool, total: int) -> str:
    recent = "" if oldest else ' aria-current="true"'
    old = ' aria-current="true"' if oldest else ""
    tag_q = f"&tag={quote(tag)}" if tag else ""
    body = f"""
<h1>Blog</h1>
<div class="split">
<div>
<form class="tools" action="/blog/buscar" method="get">
<label class="search">Buscar
<input type="search" name="q" placeholder="Una frase, no una palabra suelta"></label>
<button type="submit">Buscar</button>
</form>
<p class="sort"><a href="/blog?orden=desc{tag_q}"{recent}>Más recientes</a>
<a href="/blog?orden=asc{tag_q}"{old}>Más antiguas</a></p>
{_cards(entries)}
</div>
<aside class="side">{_categories(tags, tag, total, oldest)}</aside>
</div>
"""
    return layout("Blog — Ozkar", "Entradas del blog de Ozkar.", f"{site_url}/blog", body, "/blog")


def entry_page(entry: dict, site_url: str) -> str:
    tags = "".join(
        f'<a href="/blog?tag={quote(name)}">{esc(name)}</a>' for name in entry["tags"]
    )
    body = f"""
<a class="back" href="/blog">← Blog</a>
<article>
<h1>{esc(entry["title"])}</h1>
<time datetime="{esc(entry["date"])}">{human_date(entry["date"])}</time>
<div class="prose">{entry["content"]}</div>
<footer class="entry-cats">{tags}</footer>
</article>
"""
    plain = html_to_plain(entry["abstract"]) or entry["title"]
    return layout(
        f'{entry["title"]} — Ozkar',
        plain[:180],
        f'{site_url}/blog/{entry["slug"]}',
        body,
        "/blog",
    )


def search_page(query: str, entries: list[dict], site_url: str, message: str) -> str:
    note = f'<p class="empty">{esc(message)}</p>' if message else ""
    body = f"""
<a class="back" href="/blog">← Blog</a>
<h1>Búsqueda</h1>
<form class="tools" action="/blog/buscar" method="get">
<label class="search">Buscar
<input type="search" name="q" value="{esc(query)}"></label>
<button type="submit">Buscar</button>
</form>
{note}
{_cards(entries)}
"""
    return layout(
        "Búsqueda — Ozkar",
        "Búsqueda del blog por significado.",
        f"{site_url}/blog/buscar",
        body,
        "/blog",
        index=False,
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

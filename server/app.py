from __future__ import annotations

import asyncio
import logging
import math
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import parse_qs

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from starlette.staticfiles import StaticFiles

from server import blog_html, db, html as pages
from server.auth import TOKEN_TTL, check_password, issue_token, require_admin
from server.chunks import body_chunks
from server.config import Settings, load_settings
from server.embed_worker import embed_loop, unpack_vector

log = logging.getLogger("blog")
ROOT = Path(__file__).resolve().parents[1]


def _slug(title: str) -> str:
    import re
    import unicodedata

    text = unicodedata.normalize("NFD", title.lower())
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    if not text:
        raise HTTPException(status_code=400, detail="El título no produce un slug")
    return text


def _payload_entry(body: dict, slug: str) -> dict:
    title = str(body.get("title") or "").strip()
    content = str(body.get("content") or "").strip()
    if not title or not content:
        raise HTTPException(status_code=400, detail="Título y contenido son obligatorios")
    abstract = str(body.get("abstract") or "").strip()
    date = str(body.get("date") or "").strip()
    if len(date) < 10:
        raise HTTPException(status_code=400, detail="Fecha inválida")
    tags = body.get("tags") or []
    if not isinstance(tags, list):
        raise HTTPException(status_code=400, detail="tags debe ser una lista")
    return {
        "slug": slug,
        "title": title,
        "abstract": abstract,
        "content": content,
        "date": date[:10],
        "tags": [str(tag) for tag in tags],
        "replace_tags": True,
    }


def _cosine(left: list[float], right: list[float]) -> float:
    if len(left) != len(right) or not left:
        return 0.0
    dot = sum(a * b for a, b in zip(left, right))
    na = math.sqrt(sum(a * a for a in left))
    nb = math.sqrt(sum(b * b for b in right))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def create_app(settings: Settings | None = None) -> FastAPI:
    cfg = settings or load_settings()

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        db.init_db(cfg)
        task = asyncio.create_task(embed_loop(cfg))
        yield
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

    app = FastAPI(title="Ozkar", lifespan=lifespan)
    app.state.settings = cfg

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/api/login")
    async def login(request: Request) -> dict[str, str]:
        body = await request.json()
        username = str(body.get("username") or "")
        password = str(body.get("password") or "")
        if not check_password(cfg, username, password):
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        return {"token": issue_token(cfg, username)}

    @app.get("/api/tags")
    def tags() -> list[dict]:
        return db.list_tags(cfg)

    @app.get("/api/blog")
    def blog_index(tag: str = "", orden: str = "desc") -> list[dict]:
        return db.list_entries(cfg, tag or None, orden == "asc")

    @app.get("/api/blog/{slug}")
    def blog_one(slug: str) -> dict:
        entry = db.get_entry(cfg, slug)
        if entry is None:
            raise HTTPException(status_code=404, detail="No existe")
        return entry

    @app.post("/api/blog", status_code=201)
    async def blog_create(request: Request) -> dict:
        require_admin(request, cfg)
        body = await request.json()
        slug = str(body.get("slug") or "").strip() or _slug(str(body.get("title") or ""))
        data = _payload_entry(body, slug)
        if db.get_entry(cfg, slug) is not None:
            raise HTTPException(status_code=409, detail="Ese slug ya existe")
        pieces = body_chunks(data["title"], data["abstract"], data["content"])
        return db.save_entry(cfg, data, pieces)

    @app.put("/api/blog/{slug}")
    async def blog_update(slug: str, request: Request) -> dict:
        require_admin(request, cfg)
        if db.get_entry(cfg, slug) is None:
            raise HTTPException(status_code=404, detail="No existe")
        body = await request.json()
        data = _payload_entry(body, slug)
        pieces = body_chunks(data["title"], data["abstract"], data["content"])
        return db.save_entry(cfg, data, pieces)

    @app.delete("/api/blog/{slug}", status_code=204)
    def blog_delete(slug: str, request: Request) -> Response:
        require_admin(request, cfg)
        if not db.delete_entry(cfg, slug):
            raise HTTPException(status_code=404, detail="No existe")
        return Response(status_code=204)

    @app.get("/blog/buscar", response_class=HTMLResponse)
    async def blog_search(q: str = "") -> HTMLResponse:
        query = q.strip()
        if not query:
            page = blog_html.search_page("", [], cfg.site_url, "Escribe qué estás buscando.")
            return HTMLResponse(page)
        try:
            from server.embed_worker import _post_embed

            _model, vectors = await asyncio.to_thread(_post_embed, cfg, [query])
        except Exception as exc:
            log.warning("búsqueda: %s", exc)
            page = blog_html.search_page(
                query, [], cfg.site_url, "La búsqueda no está disponible ahora."
            )
            return HTMLResponse(page, status_code=503)
        query_vector = [float(n) for n in vectors[0]]
        scores: dict[str, float] = {}
        for slug, blob in db.vectors_by_entry(cfg):
            score = _cosine(query_vector, unpack_vector(blob))
            if slug not in scores or score > scores[slug]:
                scores[slug] = score
        ranked = sorted(scores, key=lambda slug: scores[slug], reverse=True)[:20]
        entries = []
        for slug in ranked:
            entry = db.get_entry(cfg, slug)
            if entry is not None:
                entries.append(entry)
        message = "" if entries else "Nada analizado se acerca a esa frase."
        return HTMLResponse(blog_html.search_page(query, entries, cfg.site_url, message))

    @app.get("/blog", response_class=HTMLResponse)
    @app.get("/blog/", response_class=HTMLResponse)
    def blog_html_index(tag: str = "", orden: str = "desc") -> HTMLResponse:
        entries = db.list_entries(cfg, tag or None, orden == "asc")
        page = blog_html.list_page(entries, db.list_tags(cfg), cfg.site_url, tag, orden == "asc")
        return HTMLResponse(page)

    @app.get("/blog/{slug}", response_class=HTMLResponse)
    def blog_html_entry(slug: str) -> HTMLResponse:
        entry = db.get_entry(cfg, slug)
        if entry is None:
            raise HTTPException(status_code=404, detail="No existe")
        return HTMLResponse(blog_html.entry_page(entry, cfg.site_url))

    @app.get("/rss.xml")
    def rss_feed() -> Response:
        entries = db.list_entries(cfg, None, False)
        return Response(
            blog_html.rss(entries, cfg.site_url),
            media_type="application/rss+xml",
        )

    def _guard(request: Request) -> RedirectResponse | None:
        try:
            require_admin(request, cfg)
        except HTTPException:
            return RedirectResponse("/admin", status_code=303)
        return None

    async def _fields(request: Request) -> dict[str, str]:
        raw = (await request.body()).decode()
        parsed = parse_qs(raw, keep_blank_values=True)
        return {key: values[0] for key, values in parsed.items()}

    def _save_form(fields: dict[str, str], slug: str) -> dict:
        tags = [part.strip() for part in fields.get("tags", "").split(",") if part.strip()]
        data = _payload_entry(
            {
                "title": fields.get("title", ""),
                "abstract": fields.get("abstract", ""),
                "content": fields.get("content", ""),
                "date": fields.get("date", ""),
                "tags": tags,
            },
            slug,
        )
        pieces = body_chunks(data["title"], data["abstract"], data["content"])
        return db.save_entry(cfg, data, pieces)

    @app.get("/", response_class=HTMLResponse)
    def home() -> HTMLResponse:
        return HTMLResponse(pages.home(cfg.site_url))

    @app.get("/cv", response_class=HTMLResponse)
    def cv() -> HTMLResponse:
        return HTMLResponse(pages.cv_page(cfg.site_url))

    @app.get("/projects", response_class=HTMLResponse)
    def projects() -> HTMLResponse:
        return HTMLResponse(pages.projects_page(cfg.site_url))

    @app.get("/wizz", response_class=HTMLResponse)
    def wizz() -> HTMLResponse:
        return HTMLResponse(pages.wizz_page(cfg.site_url))

    @app.get("/time", response_class=HTMLResponse)
    def time_page() -> HTMLResponse:
        return HTMLResponse(pages.time_page(cfg.site_url))

    @app.get("/clock", response_class=HTMLResponse)
    def clock() -> HTMLResponse:
        return HTMLResponse(pages.clock_page(cfg.site_url))

    @app.get("/calc", response_class=HTMLResponse)
    def calc() -> HTMLResponse:
        return HTMLResponse(pages.calc_page(cfg.site_url))

    @app.get("/admin", response_class=HTMLResponse)
    def admin_home(request: Request) -> HTMLResponse:
        try:
            require_admin(request, cfg)
        except HTTPException:
            return HTMLResponse(pages.admin_login(cfg.site_url, False))
        return HTMLResponse(pages.admin_home(cfg.site_url, db.list_entries(cfg, None, False)))

    @app.post("/admin/login")
    async def admin_login(request: Request) -> Response:
        fields = await _fields(request)
        if not check_password(cfg, fields.get("username", ""), fields.get("password", "")):
            return HTMLResponse(pages.admin_login(cfg.site_url, True), status_code=401)
        response = RedirectResponse("/admin", status_code=303)
        response.set_cookie(
            "oz_session",
            issue_token(cfg, cfg.admin_user),
            httponly=True,
            samesite="lax",
            max_age=TOKEN_TTL,
            path="/",
        )
        return response

    @app.post("/admin/salir")
    def admin_logout() -> RedirectResponse:
        response = RedirectResponse("/admin", status_code=303)
        response.delete_cookie("oz_session", path="/")
        return response

    @app.get("/admin/nueva", response_class=HTMLResponse)
    def admin_new(request: Request) -> Response:
        denied = _guard(request)
        if denied:
            return denied
        names = [item["name"] for item in db.list_tags(cfg)]
        return HTMLResponse(pages.admin_editor(cfg.site_url, None, names, ""))

    @app.post("/admin/nueva")
    async def admin_create(request: Request) -> Response:
        denied = _guard(request)
        if denied:
            return denied
        fields = await _fields(request)
        names = [item["name"] for item in db.list_tags(cfg)]
        try:
            slug = _slug(fields.get("title", ""))
        except HTTPException as exc:
            return HTMLResponse(pages.admin_editor(cfg.site_url, None, names, exc.detail), status_code=400)
        if db.get_entry(cfg, slug) is not None:
            return HTMLResponse(
                pages.admin_editor(cfg.site_url, None, names, "Ese slug ya existe"),
                status_code=409,
            )
        try:
            _save_form(fields, slug)
        except HTTPException as exc:
            return HTMLResponse(pages.admin_editor(cfg.site_url, None, names, exc.detail), status_code=400)
        return RedirectResponse("/admin", status_code=303)

    @app.get("/admin/{slug}", response_class=HTMLResponse)
    def admin_edit(slug: str, request: Request) -> Response:
        denied = _guard(request)
        if denied:
            return denied
        entry = db.get_entry(cfg, slug)
        if entry is None:
            raise HTTPException(status_code=404, detail="No existe")
        names = [item["name"] for item in db.list_tags(cfg)]
        return HTMLResponse(pages.admin_editor(cfg.site_url, entry, names, ""))

    @app.post("/admin/{slug}")
    async def admin_update(slug: str, request: Request) -> Response:
        denied = _guard(request)
        if denied:
            return denied
        entry = db.get_entry(cfg, slug)
        names = [item["name"] for item in db.list_tags(cfg)]
        if entry is None:
            raise HTTPException(status_code=404, detail="No existe")
        fields = await _fields(request)
        try:
            _save_form(fields, slug)
        except HTTPException as exc:
            shown = dict(entry)
            shown["title"] = fields.get("title", "")
            shown["abstract"] = fields.get("abstract", "")
            shown["content"] = fields.get("content", "")
            shown["date"] = fields.get("date", "")
            shown["tags"] = [part.strip() for part in fields.get("tags", "").split(",") if part.strip()]
            return HTMLResponse(pages.admin_editor(cfg.site_url, shown, names, str(exc.detail)), status_code=400)
        return RedirectResponse("/admin", status_code=303)

    @app.post("/admin/{slug}/borrar")
    def admin_delete(slug: str, request: Request) -> Response:
        denied = _guard(request)
        if denied:
            return denied
        db.delete_entry(cfg, slug)
        return RedirectResponse("/admin", status_code=303)

    @app.get("/robots.txt")
    def robots() -> Response:
        path = ROOT / "public" / "robots.txt"
        text = path.read_text(encoding="utf-8") if path.is_file() else "User-agent: *\nAllow: /\n"
        return Response(text, media_type="text/plain")

    app.mount("/s", StaticFiles(directory=str(Path(__file__).resolve().parent / "static")), name="s")
    app.mount("/assets", StaticFiles(directory=str(ROOT / "public" / "assets")), name="assets")
    astro = ROOT / "public" / "astronomical-data"
    if astro.is_dir():
        app.mount("/astronomical-data", StaticFiles(directory=str(astro)), name="astro")

    return app


app = create_app()

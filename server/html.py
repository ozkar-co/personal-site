from __future__ import annotations

import html
import random
from datetime import datetime
from pathlib import Path

WIZZ = sorted((Path(__file__).resolve().parents[1] / "public" / "assets" / "wizz").glob("*.webp"))

NAV = (
    ("/", "OZ"),
    ("/cv", "CV"),
    ("/blog", "BLOG"),
    ("/projects", "PROY"),
    ("/wizz", "WIZZ"),
    ("/time", "TIME"),
    ("/clock", "CLOCK"),
    ("/calc", "CALC"),
    ("/admin", "ADMIN"),
    ("/rss", "RSS"),
)


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def layout(
    title: str,
    description: str,
    canonical: str,
    body: str,
    current: str,
    scripts: tuple[str, ...] = (),
    *,
    index: bool = True,
) -> str:
    links = []
    for href, label in NAV:
        mark = ' aria-current="page"' if href == current else ""
        links.append(f'<a href="{href}"{mark}>{label}</a>')
    script = "".join(f'<script type="module" src="{src}"></script>' for src in scripts)
    sheets = "".join(
        f'<link rel="stylesheet" href="/s/{name}">'
        for name in ("base.css", "lectura.css", "instrumentos.css", "movimiento.css")
    )
    year = datetime.now().year
    mode = "quiet" if current.startswith("/admin") else "stage"
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
{"" if index else '<meta name="robots" content="noindex">'}
<link rel="canonical" href="{esc(canonical)}">
<link rel="icon" href="/assets/favicon.svg">
{sheets}
<link rel="alternate" type="application/rss+xml" title="Ozkar" href="/rss.xml">
</head>
<body class="{mode}">
<header>
<a class="brand" href="/">Ozkar</a>
<nav>{"".join(links)}</nav>
</header>
<main>
{body}
</main>
<footer><p>Copyright © Ozkar {year}</p></footer>
{script}
</body>
</html>
"""


def _cards(title: str, rows: list[dict], kind: str) -> str:
    blocks = [f"<h2>{esc(title)}</h2>"]
    for row in rows:
        if kind == "skill":
            items = "".join(
                f"<li>{esc(item['name'])} <span class='muted'>{esc(item['experience'])}</span></li>"
                for item in row["items"]
            )
            blocks.append(f"<article class='card'><h3>{esc(row['title'])}</h3><ul>{items}</ul></article>")
        elif kind == "about":
            items = "".join(f"<li>{esc(item)}</li>" for item in row["items"])
            blocks.append(
                "<article class='card'>"
                f"<h3>{esc(row['title'])}</h3>"
                f"<p>{esc(row['body'])}</p><ul>{items}</ul></article>"
            )
        else:
            items = "".join(f"<li>{esc(item)}</li>" for item in row["items"])
            blocks.append(
                "<article class='card'>"
                f"<h3>{esc(row['title'])}</h3>"
                f"<p class='muted'>{esc(row['organization'])} · {esc(row['location'])} · {esc(row['period'])}</p>"
                f"<ul>{items}</ul></article>"
            )
    if kind == "skill":
        return blocks[0] + "<div class='grid'>" + "".join(blocks[1:]) + "</div>"
    return "".join(blocks)


def home(site_url: str) -> str:
    body = """
<h1>Ingeniero y conjurador de algoritmos</h1>
<div class="split">
<div>
<p>Soy Oz, ingeniero de sistemas, explorador de ideas y soñador de mundos. Soy Director de Tecnología en Forja de Código, con más de una década de experiencia en desarrollo FullStack y tecnologías open-source. Me apasiona construir sistemas eficientes, escalar arquitecturas y explorar la inteligencia artificial. Pero más allá del código, soy un viajero en busca de historias, un amante de la naturaleza y un entusiasta de la fantasía. Entre líneas de programación y caminos desconocidos, encuentro inspiración para crear, innovar y compartir mi conocimiento con quienes también buscan forjar su propio destino.</p>
<p><a class="btn" href="/cv">Ver mi Curriculum Vitae</a></p>
</div>
<img class="portrait" src="/assets/profile.jpg" alt="Ozkar">
</div>
<h2>Mis habilidades</h2>
<div class="grid">
<article class="card"><h3>Lenguajes</h3><ul><li>Python</li><li>Node.js</li><li>TypeScript</li><li>Lua</li><li>PHP</li></ul></article>
<article class="card"><h3>Tecnologías</h3><ul><li>Docker</li><li>PostgreSQL</li><li>MongoDB</li><li>AWS</li><li>Linux</li></ul></article>
<article class="card"><h3>Otras experticias</h3><ul><li>Diseño de software</li><li>Desarrollo de APIs</li><li>Agile y Scrum</li><li>Proyectos open-source</li><li>Documentación técnica</li></ul></article>
</div>
<h2>Mis servicios</h2>
<div class="grid">
<article class="card"><h3>Desarrollo personalizado</h3><p>Creo aplicaciones y sistemas desde cero, adaptados a tu negocio o proyecto.</p><ul><li>Aplicaciones web y móviles</li><li>Sistemas operativos personalizados</li><li>APIs y microservicios</li><li>Bases de datos optimizadas</li></ul></article>
<article class="card"><h3>Diseño de software</h3><p>Análisis y diseño de arquitecturas robustas y escalables, antes de implementar.</p><ul><li>Arquitectura de sistemas</li><li>Diseño de interfaces</li><li>Modelado de bases de datos</li><li>Documentación técnica</li></ul></article>
<article class="card"><h3>Mantenimiento</h3><p>Ajusto aplicaciones existentes para que funcionen con tus sistemas, con soporte continuo.</p><ul><li>Configuración de sistemas</li><li>Actualizaciones y parches</li><li>Optimización de rendimiento</li><li>Migración de datos</li></ul></article>
</div>
<h2>Conecta conmigo</h2>
<p>
<a href="mailto:ozcodx@gmail.com">Correo</a> ·
<a href="https://github.com/ozkar-co">GitHub</a>
</p>
"""
    return layout("Ozkar", "Ingeniero de sistemas, blog y proyectos.", f"{site_url}/", body, "/")


def cv_page(site_url: str, blocks: list[dict]) -> str:
    def rows(kind: str) -> list[dict]:
        return [block for block in blocks if block["kind"] == kind]

    body = (
        "<h1>Curriculum Vitae</h1>"
        + _cards("Sobre mí", rows("about"), "about")
        + _cards("Habilidades", rows("skill"), "skill")
        + _cards("Experiencia", rows("experience"), "job")
        + _cards("Educación", rows("education"), "job")
        + _cards("Extra", rows("extra"), "job")
    )
    return layout("CV — Ozkar", "Curriculum vitae de Ozkar.", f"{site_url}/cv", body, "/cv")


PROJECT_SECTIONS = (
    ("Aplicaciones", (
        "forja", "koten", "marcopolo", "cuentas", "impostor",
        "fabricalc", "meye", "ozro", "lolchaos", "yd",
    )),
    ("Inteligencia artificial", ("whisper", "tts", "slm", "ocr", "embed")),
    ("Infraestructura", ("oznet",)),
)


def _project_card(project: dict) -> str:
    image = ""
    if project["image"]:
        image = f"<img src='/assets/{esc(project['image'])}' alt=''>"
    return (
        "<article class='card'>"
        f"{image}<h3>{esc(project['title'])}</h3>"
        f"<p>{esc(project['description'])}</p>"
        f"<a class='btn' href='{esc(project['url'])}'>Abrir</a>"
        "</article>"
    )


def projects_page(site_url: str, projects: list[dict]) -> str:
    by_id = {project["id"]: project for project in projects}
    used: set[str] = set()
    parts = ["<h1>Proyectos</h1>"]
    for title, ids in PROJECT_SECTIONS:
        cards = []
        for project_id in ids:
            project = by_id.get(project_id)
            if project is None:
                continue
            used.add(project_id)
            cards.append(_project_card(project))
        if cards:
            parts.append(f"<h2>{esc(title)}</h2><div class='grid projects'>{''.join(cards)}</div>")
    rest = [_project_card(project) for project in projects if project["id"] not in used]
    if rest:
        parts.append("<div class='grid projects'>" + "".join(rest) + "</div>")
    body = "".join(parts)
    return layout("Proyectos — Ozkar", "Proyectos de Ozkar.", f"{site_url}/projects", body, "/projects")


def wizz_page(site_url: str, quote: str) -> str:
    text = esc(quote).replace("; ", ";<br>").replace(". ", ".<br>")
    image = random.choice(WIZZ).name if WIZZ else ""
    picture = f"<a href='/wizz'><img src='/assets/wizz/{esc(image)}' alt='Sabio mago'></a>" if image else ""
    body = f"<section class='wizz'><blockquote class='prose'>{text}</blockquote>{picture}</section>"
    return layout("Wizz — Ozkar", "Una frase y un mago.", f"{site_url}/wizz", body, "/wizz")


def time_page(site_url: str) -> str:
    labels = ("Años", "Meses", "Días", "Horas", "Minutos", "Segundos")
    units = "".join(f"<span><b>0</b><i>{label}</i></span>" for label in labels)
    body = f"""
<h1>Time</h1>
<p class="motto">Tempus fugit, memento mori</p>
<p class="muted motto-es">El tiempo vuela, recuerda que morirás</p>
<p class="switch" id="base">
<button type="button" data-base="si" aria-pressed="true">S.I.</button>
<button type="button" data-base="doc" aria-pressed="false">Docenal</button>
</p>
<div class="grid">
<article class="card">
<h2>Tiempo vivido</h2>
<p class="digits" id="lived">{units}</p>
</article>
<article class="card remain">
<h2>Tiempo restante</h2>
<p class="digits" id="left">{units}</p>
<p id="over" hidden>Has superado tu esperanza de vida.</p>
</article>
</div>
<p class="muted note">La cuenta regresiva es una aproximación con la esperanza de vida de mi país, el historial de mi familia y mi estilo de vida. Si llega a valores negativos y aún estoy vivo, es porque he superado esa esperanza. Si he muerto y el reloj sigue, es porque quien dejé encargado de actualizar este sitio no hizo su trabajo.</p>
"""
    return layout("Time — Ozkar", "Tiempo vivido y tiempo restante.", f"{site_url}/time", body, "/time", ("/s/time.js",))


def clock_page(site_url: str) -> str:
    body = """
<h1>Clock</h1>
<div class="grid">
<article class="card">
<h2>Reloj base 12</h2>
<p class="screen dozenal" id="hora">0</p>
<p id="hora-words"></p>
<p class="digits">
<span><b class="dozenal" id="horo">0</b>horo</span>
<span><b class="dozenal" id="temo">0</b>temo</span>
<span><b class="dozenal" id="mino">0</b>mino</span>
<span><b class="dozenal" id="tiko">0</b>tiko</span>
</p>
<div class="bar"><i id="day-bar"></i></div>
<p id="day-label"></p>
</article>
<article class="card">
<h2>Calendario luni-solar</h2>
<p id="sol"></p>
<p id="lunato"></p>
<p id="jorno"></p>
<p>Fase <span id="fase"></span></p>
<div class="bar"><i id="moon-bar"></i></div>
<p id="moon-label"></p>
</article>
</div>
<header class="cal-head">
<p class="cal-nav">
<button type="button" id="prev-sol" aria-label="Sol anterior">≪</button>
<button type="button" id="prev-lunato" aria-label="Lunato anterior">←</button>
<button type="button" id="today">Lunato actual</button>
<button type="button" id="next-lunato" aria-label="Lunato siguiente">→</button>
<button type="button" id="next-sol" aria-label="Sol siguiente">≫</button>
</p>
<h2 id="cal-title"></h2>
</header>
<div id="cal"></div>
<div class="prose">
<h2>Cómo funciona</h2>
<p><strong>Dozenal.</strong> Dígitos 0-9, <span class="dozenal">χ</span> (10), <span class="dozenal">ε</span> (11). <span class="dozenal">1χ</span> = 1×12 + 10 = 22 en decimal. 12 tiene más divisores que 10: 1, 2, 3, 4, 6 y 12.</p>
<p><strong>Reloj.</strong> 1 jorno = 20 horo, y cada unidad se parte en 12. 1 horo = 1 hora civil, 1 temo ≈ 5 min, 1 mino ≈ 25 s, 1 tiko ≈ 2 s. El día empieza a medianoche, igual que el día civil.</p>
<p><strong>Sol.</strong> Año solar personal desde el solsticio de invierno de diciembre de 1992 (Sol 0). Cada Sol va de un solsticio de invierno al siguiente. Es el día más corto del año y se observa sin instrumentos.</p>
<p><strong>Lunatos.</strong> Meses lunares de unos 29,5 días. Empiezan en luna nueva, visible a simple vista. Lunato 1 es la primera luna nueva después del solsticio. Un Sol tiene 12 o 13 lunatos.</p>
<p><strong>Nombre.</strong> Cada lunato lleva la constelación sobre la que está el Sol en la eclíptica. Los doce habituales son las del zodiaco. En un Sol de trece lunatos entra Ofiuco, entre Escorpio y Sagitario.</p>
<p><strong>Signos.</strong> Cada lunato tiene su letra, en el orden del Sol desde Sagitario. Cetus y Ofiuco van en la misma serie.</p>
<ul class="signs">
<li><b class="dozenal">&#xE000;</b> Sagitario</li>
<li><b class="dozenal">&#xE001;</b> Capricornio</li>
<li><b class="dozenal">&#xE002;</b> Acuario</li>
<li><b class="dozenal">&#xE003;</b> Piscis</li>
<li><b class="dozenal">&#xE004;</b> Aries</li>
<li><b class="dozenal">&#xE005;</b> Cetus</li>
<li><b class="dozenal">&#xE006;</b> Tauro</li>
<li><b class="dozenal">&#xE007;</b> Géminis</li>
<li><b class="dozenal">&#xE008;</b> Cáncer</li>
<li><b class="dozenal">&#xE009;</b> Leo</li>
<li><b class="dozenal">&#xE00A;</b> Virgo</li>
<li><b class="dozenal">&#xE00B;</b> Libra</li>
<li><b class="dozenal">&#xE00C;</b> Escorpio</li>
<li><b class="dozenal">&#xE00D;</b> Ofiuco</li>
</ul>
<p><strong>Lunato 0.</strong> Cruza dos soles: es el último del anterior y el primero del actual. Empieza en la luna nueva anterior al solsticio y contiene ese día, marcado con ❄. Los días de antes del solsticio son del Sol anterior.</p>
<p><strong>Último lunato.</strong> El que cierra el Sol (12 o 13; <span class="dozenal">χ</span> o <span class="dozenal">ε</span>) también contiene el solsticio siguiente. Los días desde ese solsticio ya son del Sol nuevo.</p>
<p>Esos días, los que no son de este Sol, se ven en gris y con el borde gris.</p>
</div>
"""
    return layout("Clock — Ozkar", "Reloj y calendario dozenal.", f"{site_url}/clock", body, "/clock", ("/s/clock.js",))


def calc_page(site_url: str) -> str:
    def key(label: str, **data: str) -> str:
        attrs = " ".join(f'data-{name}' if value == "" else f'data-{name}="{esc(value)}"' for name, value in data.items())
        classes = []
        if "wide" in data:
            classes.append("wide")
        if data.get("digit") in {"X", "W"}:
            classes.append("dozenal")
            label = "χ" if data["digit"] == "X" else "ε"
        class_attr = f' class="{" ".join(classes)}"' if classes else ""
        return f"<button type=\"button\"{class_attr} {attrs}>{label}</button>"

    keys = [
        key("τ", fn="tau"), key("sin", fn="sin"), key("cos", fn="cos"), key("tan", fn="tan"),
        key("√", fn="sqrt"), key("asin", fn="asin"), key("acos", fn="acos"), key("atan", fn="atan"),
        key("xʸ", op="^"), key("x²", fn="square"), key("ln", fn="ln"), key("eˣ", fn="exp"),
        key("C", clear=""), key("+/-", fn="sign"), key("1/x", fn="inv"), key("÷", op="÷"),
        key("7", digit="7"), key("8", digit="8"), key("9", digit="9"), key("×", op="×"),
        key("4", digit="4"), key("5", digit="5"), key("6", digit="6"), key("-", op="-"),
        key("1", digit="1"), key("2", digit="2"), key("3", digit="3"), key("+", op="+"),
        key("0", digit="0"), key("X", digit="X"), key("W", digit="W"), key(",", dot=""),
        key("=", eq="", wide=""),
    ]
    body = f"""
<h1>Calculadora dozenal</h1>
<div class="split calc">
<div class="prose">
<h2>Cómo funciona</h2>
<p><strong>Base 12.</strong> Dígitos 0-9, <span class="dozenal">χ</span> (diez), <span class="dozenal">ε</span> (once). Potencias: 12¹ zen, 12² grod, 12³ mil. 12 tiene más divisores que 10 (1, 2, 3, 4, 6 y 12 frente a 1, 2, 5 y 10), y por eso muchas cuentas cierran sin resto.</p>
<p><strong>Nombres.</strong> 0 zero, 1 un, 2 du, 3 tri, 4 quar, 5 kin, 6 ses, 7 sep, 8 ok, 9 non, <span class="dozenal">χ</span> dek, <span class="dozenal">ε</span> elv. 10₁₂ es zen, 11₁₂ es zen un, 20₁₂ es duzen, 100₁₂ es un grod, 1000₁₂ es un mil.</p>
<p><strong>Koma.</strong> La coma separa la fracción. La parte de después se lee de a dos dígitos, cada pareja como un número: 5,3 es kin koma tri; 5,46 es kin koma quarzen ses; <span class="dozenal">ε</span>,81 es elv koma okzen un. Si una pareja lleva cero, se dice: 8,06 es ok koma zero ses. Si el último dígito queda solo, se nombra solo.</p>
<p><strong>Tau.</strong> τ = 2π. La circunferencia es τ por el radio, y un círculo son τ radianes: τ/4 es un cuarto de vuelta y τ/2 es media vuelta. 360° = τ, 180° = τ/2, 90° = τ/4, 60° = τ/6. Esta calculadora usa esos radianes.</p>
</div>
<div class="card">
<div class="readout">
<p class="screen dozenal" id="screen">0</p>
<p id="op"></p>
<p id="words"></p>
</div>
<div class="keys">{"".join(keys)}</div>
</div>
</div>
"""
    return layout("Calc — Ozkar", "Calculadora dozenal.", f"{site_url}/calc", body, "/calc", ("/s/calc.js",))


def _editor(entry: dict | None, tags: list[str], message: str) -> str:
    title = entry["title"] if entry else ""
    date = entry["date"] if entry else datetime.now().strftime("%Y-%m-%d")
    abstract = entry["abstract"] if entry else ""
    content = entry["content"] if entry else ""
    chosen = ", ".join(entry["tags"]) if entry else ""
    action = f"/admin/{esc(entry['slug'])}" if entry else "/admin/nueva"
    heading = "Editar" if entry else "Nueva entrada"
    note = f"<p class='warn'>{esc(message)}</p>" if message else ""
    known = ", ".join(esc(name) for name in tags) or "ninguna todavía"
    return f"""
<h1>{heading}</h1>
{note}
<form method="post" action="{action}">
<label>Título<input name="title" value="{esc(title)}" required></label>
<label>Fecha<input type="date" name="date" value="{esc(date)}" required></label>
<label>Resumen<textarea name="abstract">{esc(abstract)}</textarea></label>
<label>Contenido<textarea name="content" required>{esc(content)}</textarea></label>
<label>Categorías<input name="tags" value="{esc(chosen)}" placeholder="una, otra"></label>
<p class="muted">Ya existen: {known}</p>
<button type="submit">Guardar</button>
</form>
<p><a href="/admin">Volver</a></p>
"""


def admin_login(site_url: str, failed: bool) -> str:
    note = "<p class='warn'>Credenciales incorrectas.</p>" if failed else ""
    body = f"""
<section class="gate">
<h1>Admin</h1>
{note}
<form method="post" action="/admin/login">
<label>Usuario<input name="username" autocomplete="username" required></label>
<label>Clave<input type="password" name="password" autocomplete="current-password" required></label>
<button type="submit">Entrar</button>
</form>
</section>
"""
    return layout("Admin — Ozkar", "Administrar el blog.", f"{site_url}/admin", body, "/admin", index=False)


def admin_home(site_url: str, entries: list[dict]) -> str:
    rows = []
    for entry in entries:
        rows.append(
            "<article class='card'>"
            f"<h2>{esc(entry['title'])}</h2>"
            f"<p class='muted'>{esc(entry['date'])}</p>"
            f"<p><a href='/admin/{esc(entry['slug'])}'>Editar</a> · "
            f"<a href='/blog/{esc(entry['slug'])}'>Ver</a></p>"
            f"<form method='post' action='/admin/{esc(entry['slug'])}/borrar'>"
            "<button type='submit'>Borrar</button></form></article>"
        )
    listing = "".join(rows) or "<p>Ninguna entrada.</p>"
    body = f"""
<h1>Admin</h1>
<p><a class="btn" href="/admin/nueva">Nueva entrada</a></p>
<form method="post" action="/admin/salir"><button type="submit">Salir</button></form>
<div class="grid">{listing}</div>
"""
    return layout("Admin — Ozkar", "Administrar el blog.", f"{site_url}/admin", body, "/admin", index=False)


def admin_editor(site_url: str, entry: dict | None, tags: list[str], message: str) -> str:
    body = _editor(entry, tags, message)
    return layout("Editar — Ozkar", "Editar una entrada.", f"{site_url}/admin", body, "/admin", index=False)


def rss_page(site_url: str) -> str:
    feed = f"{site_url}/rss.xml"
    body = f"""
<h1>RSS</h1>
<p>El RSS es la lista del blog para un lector. Trae el título, la fecha y el resumen de cada entrada publicada.</p>
<p>La dirección:</p>
<p><a href="/rss.xml">{esc(feed)}</a></p>
<p>Cópiala en el lector. Cada consulta arma el listado con las entradas de ese momento.</p>
"""
    return layout("RSS — Ozkar", "Dirección del RSS del blog de Ozkar.", f"{site_url}/rss", body, "/rss")


PUBLIC_PATHS = ("/", "/cv", "/blog", "/projects", "/wizz", "/time", "/clock", "/calc", "/rss")


def robots_txt(site_url: str) -> str:
    return (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "Disallow: /admin\n"
        "Disallow: /api/\n"
        "Disallow: /blog/buscar\n"
        "\n"
        f"Sitemap: {site_url}/sitemap.xml\n"
    )


def sitemap_xml(site_url: str, entries: list[dict]) -> str:
    newest = max((entry["date"] for entry in entries), default="")
    rows: list[tuple[str, str]] = []
    for path in PUBLIC_PATHS:
        last = newest if path == "/blog" else ""
        rows.append((path, last))
    for entry in entries:
        rows.append((f"/blog/{entry['slug']}", entry["date"]))
    body = []
    for path, last in rows:
        loc = site_url + "/" if path == "/" else site_url + path
        extra = f"<lastmod>{esc(last)}</lastmod>" if last else ""
        body.append(f"<url><loc>{esc(loc)}</loc>{extra}</url>")
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(body)
        + "\n</urlset>\n"
    )

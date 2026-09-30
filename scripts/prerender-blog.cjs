#!/usr/bin/env node
/**
 * Baja el blog y escribe HTML estático + RSS.
 * La respuesta ya trae título, resumen y cuerpo: Archive.org
 * no depende de un fetch posterior.
 */
const fs = require("fs");
const path = require("path");

const API = "https://legacy-api.forja.cc/ozkar/blog";
const SITE = "https://ozkar.co";
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "blog");
const STATIC = path.join(__dirname, "blog-static");

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function strip(html) {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isoDate(raw) {
  let date;
  if (typeof raw === "string") date = new Date(raw);
  else if (typeof raw === "number") date = new Date(raw);
  else if (raw && raw.$date && raw.$date.$numberLong) {
    date = new Date(parseInt(raw.$date.$numberLong, 10));
  } else date = new Date(NaN);

  if (Number.isNaN(date.getTime())) fail("Fecha inválida en una entrada");
  return date.toISOString().slice(0, 10);
}

function humanDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return d + " de " + MONTHS[m - 1] + " de " + y;
}

function rssDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toUTCString();
}

function cdata(s) {
  return "<![CDATA[" + String(s).replace(/]]>/g, "]]]]><![CDATA[>") + "]]>";
}

function nav(current) {
  const items = [
    ["/", "OZ"],
    ["/cv", "CV"],
    ["/blog/", "BLOG"],
    ["/projects", "PROY"],
    ["/wizz", "WIZZ"],
    ["/time", "TIME"],
    ["/clock", "CLOCK"],
    ["/calc", "CALC"],
  ];
  return (
    '<header class="top"><a href="/">Ozkar.co</a><nav>' +
    items
      .map(function (it) {
        const here = it[0] === current ? ' aria-current="page"' : "";
        return '<a href="' + it[0] + '"' + here + ">" + it[1] + "</a>";
      })
      .join("") +
    '<a href="/rss.xml">RSS</a></nav></header>'
  );
}

function page(opts) {
  return (
    "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n" +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    "<title>" + esc(opts.title) + "</title>\n" +
    '<meta name="description" content="' + esc(opts.description) + '">\n' +
    '<link rel="canonical" href="' + esc(opts.canonical) + '">\n' +
    '<link rel="alternate" type="application/rss+xml" title="Ozkar" href="' +
    SITE + '/rss.xml">\n' +
    '<link rel="stylesheet" href="/blog/blog.css">\n' +
    "</head>\n<body>\n" +
    nav(opts.nav) +
    '<main class="wrap">\n' +
    opts.body +
    "\n</main>\n" +
    (opts.script ? '<script src="/blog/blog.js"></script>\n' : "") +
    "</body>\n</html>\n"
  );
}

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

async function main() {
  const res = await fetch(API);
  if (!res.ok) fail("Blog API " + res.status);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) fail("Blog API sin entradas");

  const entries = data.map(function (row) {
    const slug = String(row.slug || "");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail("Slug inválido: " + slug);
    const date = isoDate(row.date);
    const tags = Array.isArray(row.tags) ? row.tags.map(String) : [];
    return {
      slug: slug,
      title: String(row.title || slug),
      date: date,
      tags: tags,
      abstract: String(row.abstract || ""),
      content: String(row.content || ""),
    };
  });

  entries.sort(function (a, b) {
    return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
  });

  const counts = new Map();
  entries.forEach(function (e) {
    e.tags.forEach(function (t) {
      counts.set(t, (counts.get(t) || 0) + 1);
    });
  });
  const maxCount = Math.max.apply(null, Array.from(counts.values()));

  rmrf(OUT);
  fs.mkdirSync(OUT, { recursive: true });
  fs.copyFileSync(path.join(STATIC, "blog.css"), path.join(OUT, "blog.css"));
  fs.copyFileSync(path.join(STATIC, "blog.js"), path.join(OUT, "blog.js"));

  const cloud = Array.from(counts.entries())
    .sort(function (a, b) {
      return b[1] - a[1] || a[0].localeCompare(b[0], "es");
    })
    .map(function (pair) {
      const w = Math.max(1, Math.round((pair[1] / maxCount) * 5));
      const href = "/blog/?tag=" + encodeURIComponent(pair[0]);
      return (
        '<a href="' + href + '" data-tag="' + esc(pair[0]) +
        '" style="--w:' + w + '">' + esc(pair[0]) + "</a>"
      );
    })
    .join("");

  const items = entries
    .map(function (e) {
      const text = strip(e.title + " " + e.abstract);
      return (
        '<li data-date="' + e.date + '" data-tags="' + esc(JSON.stringify(e.tags)) +
        '" data-text="' + esc(text) + '"><article>' +
        "<h2><a href=\"/blog/" + e.slug + '/">' + esc(e.title) + "</a></h2>" +
        '<time datetime="' + e.date + '">' + humanDate(e.date) + "</time>" +
        '<div class="abstract">' + e.abstract + "</div>" +
        "</article></li>"
      );
    })
    .join("\n");

  const listBody =
    "<h1>Blog</h1>\n" +
    '<div class="layout">\n<div>\n' +
    '<form class="tools" action="/blog/" method="get">\n' +
    '<label class="search">Buscar\n' +
    '<input id="q" type="search" name="q" placeholder="Título o resumen"></label>\n' +
    '<div class="sort" role="group" aria-label="Orden">\n' +
    '<button type="button" data-sort="desc" aria-pressed="true">Más recientes</button>\n' +
    '<button type="button" data-sort="asc" aria-pressed="false">Más antiguas</button>\n' +
    "</div>\n" +
    "</form>\n" +
    '<p id="blog-empty" class="empty" hidden>Ninguna entrada coincide.</p>\n' +
    '<ol class="entries" id="entries">\n' + items + "\n</ol>\n" +
    "</div>\n" +
    '<nav class="tag-cloud" aria-label="Etiquetas">' + cloud + "</nav>\n" +
    "</div>\n";

  fs.writeFileSync(
    path.join(OUT, "index.html"),
    page({
      title: "Blog — Ozkar",
      description: "Entradas del blog de Ozkar.",
      canonical: SITE + "/blog/",
      nav: "/blog/",
      body: listBody,
      script: true,
    })
  );

  entries.forEach(function (e) {
    const dir = path.join(OUT, e.slug);
    fs.mkdirSync(dir, { recursive: true });
    const tags = e.tags
      .map(function (t) {
        return (
          '<a href="/blog/?tag=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>"
        );
      })
      .join("");
    const body =
      '<a class="back" href="/blog/">← Blog</a>\n' +
      "<article>\n<h1>" + esc(e.title) + "</h1>\n" +
      '<time datetime="' + e.date + '">' + humanDate(e.date) + "</time>\n" +
      '<div class="entry-body">' + e.content + "</div>\n" +
      '<footer class="tags">' + tags + "</footer>\n</article>\n";
    fs.writeFileSync(
      path.join(dir, "index.html"),
      page({
        title: e.title + " — Ozkar",
        description: strip(e.abstract).slice(0, 180) || e.title,
        canonical: SITE + "/blog/" + e.slug + "/",
        nav: "/blog/",
        body: body,
        script: false,
      })
    );
  });

  const rssItems = entries
    .map(function (e) {
      const link = SITE + "/blog/" + e.slug + "/";
      return (
        "<item><title>" + esc(e.title) + "</title>" +
        "<link>" + link + "</link>" +
        "<guid isPermaLink=\"true\">" + link + "</guid>" +
        "<pubDate>" + rssDate(e.date) + "</pubDate>" +
        "<description>" + cdata(e.abstract || e.content) + "</description></item>"
      );
    })
    .join("");

  const rss =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0"><channel>' +
    "<title>Ozkar</title>" +
    "<link>" + SITE + "/blog/</link>" +
    "<description>Blog de Ozkar</description>" +
    "<language>es</language>" +
    "<lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>" +
    rssItems +
    "</channel></rss>\n";

  fs.writeFileSync(path.join(ROOT, "public", "rss.xml"), rss);
  console.log("Blog estático: " + entries.length + " entradas, " + counts.size + " etiquetas");
}

main().catch(function (err) {
  fail(err && err.message ? err.message : String(err));
});

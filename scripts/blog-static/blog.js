(function () {
  var list = document.getElementById("entries");
  if (!list) return;

  var items = Array.prototype.slice.call(list.children);
  var input = document.getElementById("q");
  var empty = document.getElementById("blog-empty");

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function write(next) {
    var s = next.toString();
    var url = window.location.pathname + (s ? "?" + s : "");
    window.history.replaceState(null, "", url);
  }

  function apply() {
    var q = (params().get("q") || "").trim().toLowerCase();
    var tag = params().get("tag") || "";
    var asc = params().get("orden") === "asc";

    items.sort(function (a, b) {
      var c = a.getAttribute("data-date").localeCompare(b.getAttribute("data-date"));
      return asc ? c : -c;
    });
    items.forEach(function (el) {
      list.appendChild(el);
    });

    var shown = 0;
    items.forEach(function (el) {
      var tags = [];
      try {
        tags = JSON.parse(el.getAttribute("data-tags") || "[]");
      } catch (e) {
        tags = [];
      }
      var text = (el.getAttribute("data-text") || "").toLowerCase();
      var ok = (!tag || tags.indexOf(tag) !== -1) && (!q || text.indexOf(q) !== -1);
      el.hidden = !ok;
      if (ok) shown += 1;
    });

    if (empty) empty.hidden = shown !== 0;

    document.querySelectorAll("[data-tag]").forEach(function (a) {
      a.classList.toggle("is-on", a.getAttribute("data-tag") === tag);
    });
    document.querySelectorAll("[data-sort]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-sort") === (asc ? "asc" : "desc") ? "true" : "false");
    });

    if (input && input.value !== (params().get("q") || "")) {
      input.value = params().get("q") || "";
    }
  }

  function setQuery(q) {
    var next = params();
    if (q) next.set("q", q);
    else next.delete("q");
    write(next);
    apply();
  }

  if (input) {
    input.addEventListener("input", function () {
      setQuery(input.value.trim());
    });
    var form = input.form;
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        setQuery(input.value.trim());
      });
    }
  }

  document.querySelectorAll("[data-sort]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = params();
      next.set("orden", btn.getAttribute("data-sort"));
      write(next);
      apply();
    });
  });

  var legacy = params().get("id");
  if (legacy) {
    window.location.replace("/blog/" + encodeURIComponent(legacy) + "/");
    return;
  }

  apply();
})();

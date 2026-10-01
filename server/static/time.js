import { showDozenal, formatDozenal } from "/s/lib.js";

const birth = new Date("1993-01-08T22:30:00-05:00");
const death = new Date(birth.getTime() + 80.3 * 365.25 * 24 * 60 * 60 * 1000);
const jorno = 24 * 60 * 60 * 1000;
const horo = 60 * 60 * 1000;
const temo = 5 * 60 * 1000;
const mino = 25 * 1000;
const tiko = mino / 12;
const sol = 365.25 * jorno;
const year = 365.25 * 24 * 60 * 60 * 1000;
const month = 30.44 * 24 * 60 * 60 * 1000;
const day = 24 * 60 * 60 * 1000;

const SI = ["Años", "Meses", "Días", "Horas", "Minutos", "Segundos"];
const DOC = ["Sol", "Jorno", "Horo", "Temo", "Mino", "Tiko"];

let base = "si";
try {
  if (localStorage.getItem("oz-time-base") === "doc") base = "doc";
} catch {
  base = "si";
}

function split(diff, sizes) {
  const sign = diff < 0 ? -1 : 1;
  let left = Math.abs(diff);
  return sizes.map((size) => {
    const count = Math.floor(left / size);
    left -= count * size;
    return count * sign;
  });
}

function civil(diff) {
  return split(diff, [year, month, day, 3600000, 60000, 1000]);
}

function dozenal(diff) {
  return split(diff, [sol, jorno, horo, temo, mino, tiko]);
}

function paint(id, values, labels) {
  const dozenalMode = base === "doc";
  document.getElementById(id).querySelectorAll("span").forEach((span, index) => {
    const figure = span.querySelector("b");
    const amount = Math.abs(values[index]);
    figure.textContent = dozenalMode ? showDozenal(formatDozenal(amount)) : String(amount);
    figure.classList.toggle("dozenal", dozenalMode);
    span.querySelector("i").textContent = labels[index];
  });
}

function markSwitch() {
  document.querySelectorAll("#base button").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.base === base ? "true" : "false");
  });
}

function tick() {
  const now = Date.now();
  const labels = base === "doc" ? DOC : SI;
  const count = base === "doc" ? dozenal : civil;
  const lived = count(now - birth.getTime());
  const left = count(death.getTime() - now);
  paint("lived", lived, labels);
  paint("left", left, labels);
  document.getElementById("left").classList.toggle("warn", left[0] < 0);
  document.getElementById("over").hidden = left[0] >= 0;
  markSwitch();
}

document.getElementById("base").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  base = button.dataset.base;
  try {
    localStorage.setItem("oz-time-base", base);
  } catch {
    /* the choice still lasts for this visit */
  }
  tick();
});

tick();
setInterval(tick, 1000);

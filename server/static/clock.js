import {
  ready,
  getOzkarClock,
  getOzkarCalendar,
  getDayProgress,
  getLunatoProgress,
  getLunatoForSol,
  countLunatosInSol,
  formatDozenal,
  dozenalToWords,
  readFractionalPart,
  showDozenal,
} from "/s/lib.js";

function mark(value) {
  return `<span class="dozenal">${showDozenal(value)}</span>`;
}

const $ = (id) => document.getElementById(id);
let solOffset = 0;
let lunatoNumber = null;

function percent(value) {
  return formatDozenal(Math.round((value / 100) * 144));
}

function sign(constellation) {
  if (!constellation || !constellation.sign) return "";
  const name = constellation.name || "";
  return `<span class="dozenal sign" title="${name}">${constellation.sign}</span>`;
}

function paintCalendar(calendar) {
  if (lunatoNumber === null) lunatoNumber = calendar.lunato;
  const sol = calendar.sol + solOffset;
  let info;
  try {
    info = getLunatoForSol(sol, lunatoNumber);
  } catch {
    $("cal").textContent = "Ese lunato no se puede armar.";
    return;
  }
  $("cal-title").innerHTML = `Sol ${mark(info.solDozenal)} · Lunato ${mark(info.lunatoDozenal)} ${sign(info.constellation)}`;
  const blocks = Object.values(info.phases).filter((days) => days.length);
  $("cal").innerHTML = blocks.map((days) => {
    const cells = days.map((day) => {
      const when = day.civilDate.toLocaleDateString("es-ES", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      });
      const cls = day.isToday ? "today" : day.belongsToCurrentSol ? "" : "dim";
      const mark = day.isSolstice ? " ❄" : "";
      return `<span class="${cls}"><b class="dozenal">${showDozenal(day.jornoDozenal)}</b>${mark} ${when}</span>`;
    }).join("");
    return `<p>${days[0].lunarPhase}</p><div class="days">${cells}</div>`;
  }).join("");
}

function tick() {
  const now = new Date();
  const clock = getOzkarClock(now);
  const calendar = getOzkarCalendar(now);
  $("hora").textContent = showDozenal(clock.formatted);
  const horo = dozenalToWords(formatDozenal(clock.horo));
  const frac = readFractionalPart(`${formatDozenal(clock.temo)}${formatDozenal(clock.mino)}`);
  $("hora-words").textContent = `Es ${horo} koma ${frac} horo`;
  for (const key of ["horo", "temo", "mino", "tiko"]) {
    $(key).textContent = showDozenal(formatDozenal(clock[key]));
  }
  const day = getDayProgress(now);
  $("day-bar").style.width = `${day}%`;
  $("day-label").innerHTML = `Progreso del jorno: ${mark(percent(day))}%`;
  $("sol").innerHTML = `Sol ${mark(calendar.solDozenal)}`;
  $("lunato").innerHTML = `Lunato ${calendar.lunato} ${sign(calendar.constellation)} ${calendar.constellation.name}`;
  const jorno = dozenalToWords(formatDozenal(calendar.jorno));
  $("jorno").textContent = `${clock.period} di la jorno ${calendar.jorno} (${jorno})`;
  $("fase").textContent = calendar.lunarPhase;
  const moon = getLunatoProgress(calendar);
  $("moon-bar").style.width = `${moon}%`;
  $("moon-label").innerHTML = `Progreso del lunato: ${mark(percent(moon))}%`;
  paintCalendar(calendar);
}

function moveLunato(step) {
  const calendar = getOzkarCalendar(new Date());
  const sol = calendar.sol + solOffset;
  if (step < 0 && lunatoNumber === 0) {
    solOffset -= 1;
    lunatoNumber = countLunatosInSol(sol - 1) - 1;
  } else if (step > 0 && lunatoNumber >= countLunatosInSol(sol) - 1) {
    solOffset += 1;
    lunatoNumber = 0;
  } else {
    lunatoNumber += step;
  }
  tick();
}

function moveSol(step) {
  const calendar = getOzkarCalendar(new Date());
  const total = countLunatosInSol(calendar.sol + solOffset + step);
  solOffset += step;
  if (lunatoNumber >= total) lunatoNumber = total - 1;
  tick();
}

await ready();
tick();
setInterval(tick, 1000);
$("prev-sol").onclick = () => moveSol(-1);
$("next-sol").onclick = () => moveSol(1);
$("prev-lunato").onclick = () => moveLunato(-1);
$("next-lunato").onclick = () => moveLunato(1);
$("today").onclick = () => {
  solOffset = 0;
  lunatoNumber = getOzkarCalendar(new Date()).lunato;
  tick();
};

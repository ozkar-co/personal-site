const birth = new Date("1993-01-08T22:30:00-05:00");
const death = new Date(birth.getTime() + 80.3 * 365.25 * 24 * 60 * 60 * 1000);
const units = ["years", "months", "days", "hours", "minutes", "seconds"];
const year = 365.25 * 24 * 60 * 60 * 1000;
const month = 30.44 * 24 * 60 * 60 * 1000;
const day = 24 * 60 * 60 * 1000;

function parts(diff) {
  const sign = diff < 0 ? -1 : 1;
  let left = Math.abs(diff);
  const out = {};
  for (const [name, size] of [["years", year], ["months", month], ["days", day], ["hours", 3600000], ["minutes", 60000], ["seconds", 1000]]) {
    out[name] = Math.floor(left / size) * sign;
    left %= size;
  }
  return out;
}

function paint(id, values) {
  const box = document.getElementById(id);
  box.querySelectorAll("b").forEach((node, index) => {
    node.textContent = String(Math.abs(values[units[index]]));
  });
}

function tick() {
  const now = Date.now();
  const lived = parts(now - birth.getTime());
  const left = parts(death.getTime() - now);
  paint("lived", lived);
  paint("left", left);
  document.getElementById("left").classList.toggle("warn", left.years < 0);
  document.getElementById("over").hidden = left.years >= 0;
}

tick();
setInterval(tick, 1000);

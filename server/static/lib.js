// src/utils/ozkarTime.ts
var DOZENAL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "W"];
var LUNAR_PHASES = [
  "Nova",
  // Luna nueva
  "Pre-plena",
  // Creciente
  "Plena",
  // Luna llena
  "Pre-nova"
  // Menguante
];
var ZODIAC_CONSTELLATIONS = [
  { name: "Capricornio", nameShort: "Cap", start: 270, end: 300, image: "Capricornus_symbol_(fixed_width).svg.png" },
  { name: "Acuario", nameShort: "Acu", start: 300, end: 330, image: "Aquarius_symbol_(fixed_width).svg.png" },
  { name: "Piscis", nameShort: "Pis", start: 330, end: 360, image: "Pisces_symbol_(fixed_width).svg.png" },
  { name: "Aries", nameShort: "Ari", start: 0, end: 30, image: "Aries_symbol_(fixed_width).svg.png" },
  { name: "Cetus", nameShort: "Cet", start: 15, end: 45, image: "Cetus_symbol_(fixed_width).svg.png" },
  { name: "Tauro", nameShort: "Tau", start: 30, end: 60, image: "Taurus_symbol_(fixed_width).svg.png" },
  { name: "G\xE9minis", nameShort: "G\xE9m", start: 60, end: 90, image: "Gemini_symbol_(fixed_width).svg.png" },
  { name: "C\xE1ncer", nameShort: "C\xE1n", start: 90, end: 120, image: "Cancer_symbol_(fixed_width).svg.png" },
  { name: "Leo", nameShort: "Leo", start: 120, end: 150, image: "Leo_symbol_(fixed_width).svg.png" },
  { name: "Virgo", nameShort: "Vir", start: 150, end: 180, image: "Virgo_symbol_(fixed_width).svg.png" },
  { name: "Libra", nameShort: "Lib", start: 180, end: 210, image: "Libra_symbol_(fixed_width).svg.png" },
  { name: "Escorpio", nameShort: "Esc", start: 210, end: 240, image: "Scorpius_symbol_(fixed_width).svg.png" },
  { name: "Ofiuco", nameShort: "Ofi", start: 240, end: 270, image: "Ophiuchus_symbol_(fixed_width).svg.png" },
  { name: "Sagitario", nameShort: "Sag", start: 265, end: 275, image: "Sagittarius_symbol_(fixed_width).svg.png" }
];
var getConstellationForLunato = (lunatoNumber) => {
  const lunatoSequence = [
    13,
    // Lunato 0: Sagitario (índice 13 en ZODIAC_CONSTELLATIONS)
    0,
    // Lunato 1: Capricornio
    1,
    // Lunato 2: Acuario
    2,
    // Lunato 3: Piscis
    3,
    // Lunato 4: Aries
    4,
    // Lunato 5: Cetus
    5,
    // Lunato 6: Tauro
    6,
    // Lunato 7: Géminis
    7,
    // Lunato 8: Cáncer
    8,
    // Lunato 9: Leo
    9,
    // Lunato 10 (X): Virgo
    10,
    // Lunato 11 (W): Libra
    11,
    // Lunato 12: Escorpio
    12
    // Lunato 13: Ofiuco
  ];
  if (lunatoNumber >= 0 && lunatoNumber < lunatoSequence.length) {
    return ZODIAC_CONSTELLATIONS[lunatoSequence[lunatoNumber]];
  }
  return ZODIAC_CONSTELLATIONS[13];
};
var astronomicalDataCache = { loaded: false };
var loadAstronomicalData = async () => {
  if (astronomicalDataCache.loaded) return;
  try {
    const response = await fetch("/astronomical-data/astronomical-data.json");
    if (response.ok) {
      const data = await response.json();
      astronomicalDataCache.newMoons = data.newMoons;
      astronomicalDataCache.winterSolstices = data.winterSolstices;
      astronomicalDataCache.loaded = true;
      console.log("\u2705 Datos astron\xF3micos precalculados cargados");
    }
  } catch (error) {
    console.warn("\u26A0\uFE0F  No se pudieron cargar datos precalculados, usando c\xE1lculos", error);
  }
  astronomicalDataCache.loaded = true;
};
if (typeof window !== "undefined") {
  loadAstronomicalData();
}
var toDozenal = (decimal) => {
  if (decimal === 0) return "0";
  let result = "";
  let num = Math.abs(Math.floor(decimal));
  while (num > 0) {
    result = DOZENAL_DIGITS[num % 12] + result;
    num = Math.floor(num / 12);
  }
  return decimal < 0 ? "-" + result : result;
};
var toDozenalWithDecimals = (decimal, precision = 12) => {
  if (decimal === 0) return "0";
  const isNegative = decimal < 0;
  const absValue = Math.abs(decimal);
  const integerPart = Math.floor(absValue);
  let integerResult = "";
  let num = integerPart;
  if (num === 0) {
    integerResult = "0";
  } else {
    while (num > 0) {
      integerResult = DOZENAL_DIGITS[num % 12] + integerResult;
      num = Math.floor(num / 12);
    }
  }
  let fractionalPart = absValue - integerPart;
  let fractionalResult = "";
  if (fractionalPart > 0 && precision > 0) {
    fractionalResult = ",";
    for (let i = 0; i < precision; i++) {
      fractionalPart *= 12;
      const digit = Math.floor(fractionalPart);
      fractionalResult += DOZENAL_DIGITS[digit];
      fractionalPart -= digit;
      if (fractionalPart === 0) break;
    }
  }
  return (isNegative ? "-" : "") + integerResult + fractionalResult;
};
var fromDozenal = (dozenal) => {
  const str = dozenal.toUpperCase().replace(/^Z/, "");
  const parts = str.split(/[.,]/);
  let result = 0;
  for (let i = 0; i < parts[0].length; i++) {
    const digit = parts[0][i];
    let value;
    if (digit === "X") value = 10;
    else if (digit === "W") value = 11;
    else if (digit === "-") continue;
    else value = parseInt(digit, 10);
    result = result * 12 + value;
  }
  if (parts.length > 1) {
    let fractionalValue = 0;
    for (let i = 0; i < parts[1].length; i++) {
      const digit = parts[1][i];
      let value;
      if (digit === "X") value = 10;
      else if (digit === "W") value = 11;
      else value = parseInt(digit, 10);
      fractionalValue += value / Math.pow(12, i + 1);
    }
    result += fractionalValue;
  }
  if (dozenal.startsWith("-")) {
    result = -result;
  }
  return result;
};
var getWinterSolstice = (year) => {
  if (astronomicalDataCache.winterSolstices) {
    const solstice = astronomicalDataCache.winterSolstices.find((s) => s.year === year);
    if (solstice) {
      return new Date(solstice.date);
    }
  }
  return new Date(year, 11, 21, 0, 0, 0);
};
var getNewMoonDates = (year) => {
  if (astronomicalDataCache.newMoons) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);
    return astronomicalDataCache.newMoons.map((dateStr) => new Date(dateStr)).filter((date) => date >= yearStart && date <= yearEnd);
  }
  const SYNODIC_MONTH = 29.53059;
  const REFERENCE_NEW_MOON = /* @__PURE__ */ new Date("2000-01-06T18:14:00Z");
  const newMoons = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  const daysSinceReference = (startDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (24 * 60 * 60 * 1e3);
  const cyclesSinceReference = daysSinceReference / SYNODIC_MONTH;
  const nextCycleStart = Math.ceil(cyclesSinceReference);
  for (let i = nextCycleStart; ; i++) {
    const newMoonTime = REFERENCE_NEW_MOON.getTime() + i * SYNODIC_MONTH * 24 * 60 * 60 * 1e3;
    const newMoon = new Date(newMoonTime);
    if (newMoon > endDate) break;
    if (newMoon >= startDate) {
      newMoons.push(newMoon);
    }
  }
  return newMoons;
};
var getLunatoInfo = (date, solstice) => {
  const year = date.getFullYear();
  const prevYearNewMoons = getNewMoonDates(year - 1);
  const currentYearNewMoons = getNewMoonDates(year);
  const nextYearNewMoons = getNewMoonDates(year + 1);
  const allNewMoons = [...prevYearNewMoons, ...currentYearNewMoons, ...nextYearNewMoons];
  allNewMoons.sort((a, b) => a.getTime() - b.getTime());
  const solsticeOnNewMoon = allNewMoons.find(
    (moon) => moon.toDateString() === solstice.toDateString()
  );
  let lunato0Start;
  if (solsticeOnNewMoon) {
    lunato0Start = solsticeOnNewMoon;
  } else {
    let foundStart = null;
    for (let i = allNewMoons.length - 1; i >= 0; i--) {
      if (allNewMoons[i] < solstice) {
        foundStart = allNewMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice;
  }
  const lunato0Index = allNewMoons.findIndex(
    (moon) => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1e3 * 60 * 60
    // Tolerancia de 1 hora
  );
  if (lunato0Index === -1) {
    return { lunato: 0, jorno: 1, lunatoStart: lunato0Start };
  }
  for (let i = lunato0Index; i < allNewMoons.length - 1; i++) {
    const currentLunatoStart = allNewMoons[i];
    const nextLunatoStart = allNewMoons[i + 1];
    if (date >= currentLunatoStart && date < nextLunatoStart) {
      const lunato2 = i - lunato0Index;
      const daysSinceLunatoStart2 = Math.floor(
        (date.getTime() - currentLunatoStart.getTime()) / (24 * 60 * 60 * 1e3)
      );
      const jorno2 = daysSinceLunatoStart2 + 1;
      return { lunato: lunato2, jorno: jorno2, lunatoStart: currentLunatoStart };
    }
  }
  const lastIndex = allNewMoons.length - 1;
  const lunatoStart = allNewMoons[lastIndex];
  const lunato = lastIndex - lunato0Index;
  const daysSinceLunatoStart = Math.floor(
    (date.getTime() - lunatoStart.getTime()) / (24 * 60 * 60 * 1e3)
  );
  const jorno = daysSinceLunatoStart + 1;
  return { lunato, jorno, lunatoStart };
};
var getLunarPhase = (jorno) => {
  if (jorno <= 7) return LUNAR_PHASES[0];
  if (jorno <= 15) return LUNAR_PHASES[1];
  if (jorno <= 22) return LUNAR_PHASES[2];
  return LUNAR_PHASES[3];
};
var getOzkarClock = (date = /* @__PURE__ */ new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const horo = hours;
  const secondsIntoHour = minutes * 60 + seconds + milliseconds / 1e3;
  const secondsPerTemo = 300;
  const temo = Math.min(Math.floor(secondsIntoHour / secondsPerTemo), 11);
  const secondsIntoTemo = secondsIntoHour % secondsPerTemo;
  const secondsPerMino = 25;
  const mino = Math.min(Math.floor(secondsIntoTemo / secondsPerMino), 11);
  const secondsIntoMino = secondsIntoTemo % secondsPerMino;
  const secondsPerTiko = 25 / 12;
  const tiko = Math.min(Math.floor(secondsIntoMino / secondsPerTiko), 11);
  const period = horo < 12 ? "matino" : "vespero";
  const periodHoro = horo < 12 ? horo : horo - 12;
  const horoDozenal = toDozenal(horo);
  const temoDozenal = toDozenal(temo);
  const minoDozenal = toDozenal(mino);
  const tikoDozenal = toDozenal(tiko);
  const formatted = `${horoDozenal},${temoDozenal}${minoDozenal}`;
  const formattedFull = `${horoDozenal},${temoDozenal}${minoDozenal},${tikoDozenal}`;
  return {
    horo,
    temo,
    mino,
    tiko,
    formatted,
    formattedFull,
    period,
    periodHoro
  };
};
var getOzkarCalendar = (date = /* @__PURE__ */ new Date()) => {
  const currentYear = date.getFullYear();
  const sol0Year = 1992;
  let recentSolstice;
  const currentYearSolstice = getWinterSolstice(currentYear);
  if (date >= currentYearSolstice) {
    recentSolstice = currentYearSolstice;
  } else {
    recentSolstice = getWinterSolstice(currentYear - 1);
  }
  const sol = recentSolstice.getFullYear() - sol0Year;
  const { lunato, jorno, lunatoStart } = getLunatoInfo(date, recentSolstice);
  const lunarPhase = getLunarPhase(jorno);
  const constellation = getConstellationForLunato(lunato);
  const solDozenal = toDozenal(sol);
  const formatted = `Sol ${solDozenal} \xB7 Lunato ${lunato} \xB7 Jorno ${jorno}`;
  return {
    sol,
    solDozenal,
    lunato,
    jorno,
    lunatoStartDate: lunatoStart,
    lunarPhase,
    constellation,
    formatted
  };
};
var getDayProgress = (date = /* @__PURE__ */ new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const secondsInDay = 24 * 60 * 60;
  return totalSeconds / secondsInDay * 100;
};
var getLunatoProgress = (calendar) => {
  const SYNODIC_MONTH = 29.53;
  return Math.min(calendar.jorno / SYNODIC_MONTH * 100, 100);
};
var getLunatoForSol = (sol, lunatoNumber) => {
  const sol0Year = 1992;
  const solsticeYear = sol0Year + sol;
  const solstice = getWinterSolstice(solsticeYear);
  const newMoons = [];
  for (let y = solsticeYear - 1; y <= solsticeYear + 2; y++) {
    newMoons.push(...getNewMoonDates(y));
  }
  newMoons.sort((a, b) => a.getTime() - b.getTime());
  const solsticeOnNewMoon = newMoons.find(
    (moon) => moon.toDateString() === solstice.toDateString()
  );
  let lunato0Start;
  if (solsticeOnNewMoon) {
    lunato0Start = solsticeOnNewMoon;
  } else {
    let foundStart = null;
    for (let i = newMoons.length - 1; i >= 0; i--) {
      if (newMoons[i] < solstice) {
        foundStart = newMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice;
  }
  const lunato0Index = newMoons.findIndex(
    (moon) => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1e3 * 60 * 60
  );
  if (lunato0Index === -1 || lunato0Index + lunatoNumber >= newMoons.length - 1) {
    throw new Error(`No se puede calcular el lunato ${lunatoNumber} para el Sol ${sol}`);
  }
  const lunatoStart = newMoons[lunato0Index + lunatoNumber];
  const lunatoEnd = newMoons[lunato0Index + lunatoNumber + 1];
  return buildLunatoCalendar(sol, lunatoNumber, solstice, lunatoStart, lunatoEnd);
};
var countLunatosInSol = (sol) => {
  const sol0Year = 1992;
  const solsticeYear = sol0Year + sol;
  const solstice = getWinterSolstice(solsticeYear);
  const nextSolstice = getWinterSolstice(solsticeYear + 1);
  const newMoons = [];
  for (let y = solsticeYear - 1; y <= solsticeYear + 2; y++) {
    newMoons.push(...getNewMoonDates(y));
  }
  newMoons.sort((a, b) => a.getTime() - b.getTime());
  const solsticeOnNewMoon = newMoons.find(
    (moon) => moon.toDateString() === solstice.toDateString()
  );
  let lunato0Start;
  if (solsticeOnNewMoon) {
    lunato0Start = solsticeOnNewMoon;
  } else {
    let foundStart = null;
    for (let i = newMoons.length - 1; i >= 0; i--) {
      if (newMoons[i] < solstice) {
        foundStart = newMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice;
  }
  let count = 0;
  const lunato0Index = newMoons.findIndex(
    (moon) => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1e3 * 60 * 60
  );
  for (let i = lunato0Index; i < newMoons.length - 1; i++) {
    const lunatoStart = newMoons[i];
    const lunatoEnd = newMoons[i + 1];
    count++;
    if (lunatoStart <= nextSolstice && lunatoEnd > nextSolstice) {
      break;
    }
  }
  return count;
};
var buildLunatoCalendar = (sol, lunatoNumber, solstice, lunatoStart, lunatoEnd) => {
  const days = [];
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setHours(0, 0, 0, 0);
  const nextSolstice = getWinterSolstice(solstice.getFullYear() + 1);
  const containsThisSolstice = lunatoStart <= solstice && lunatoEnd > solstice;
  const containsNextSolstice = lunatoStart <= nextSolstice && lunatoEnd > nextSolstice;
  let currentDay = new Date(lunatoStart);
  let jorno = 1;
  while (currentDay < lunatoEnd) {
    const isSolsticeDay = currentDay.toDateString() === solstice.toDateString() || currentDay.toDateString() === nextSolstice.toDateString();
    let belongsToCurrentSol = true;
    if (lunatoNumber === 0 && containsThisSolstice) {
      belongsToCurrentSol = currentDay >= solstice;
    } else if (containsNextSolstice) {
      belongsToCurrentSol = currentDay < nextSolstice;
    }
    const dayInfo = {
      jorno,
      jornoDozenal: toDozenal(jorno),
      civilDate: new Date(currentDay),
      lunarPhase: getLunarPhase(jorno),
      isToday: currentDay.toDateString() === currentDate.toDateString(),
      isSolstice: isSolsticeDay,
      belongsToCurrentSol
    };
    days.push(dayInfo);
    currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1e3);
    jorno++;
  }
  const constellation = getConstellationForLunato(lunatoNumber);
  const phases = {
    novLuno: days.filter((d) => d.jorno <= 7),
    prePlena: days.filter((d) => d.jorno > 7 && d.jorno <= 15),
    plena: days.filter((d) => d.jorno > 15 && d.jorno <= 22),
    preNova: days.filter((d) => d.jorno > 22)
  };
  return {
    lunato: lunatoNumber,
    lunatoDozenal: toDozenal(lunatoNumber),
    sol,
    solDozenal: toDozenal(sol),
    constellation,
    startDate: lunatoStart,
    endDate: lunatoEnd,
    days,
    phases
  };
};

// src/utils/dozenalNaming.ts
var DIGIT_NAMES = {
  "0": "zero",
  "1": "un",
  "2": "du",
  "3": "tri",
  "4": "quar",
  "5": "kin",
  "6": "ses",
  "7": "sep",
  "8": "ok",
  "9": "non",
  "X": "dek",
  "W": "elv"
};
var MAGNITUDES = [
  { value: Math.pow(12, 9), name: "miliardo" },
  { value: Math.pow(12, 6), name: "milion" },
  { value: Math.pow(12, 3), name: "mil" },
  { value: Math.pow(12, 2), name: "grod" },
  { value: 12, name: "zen" },
  { value: 1, name: "" }
];
var numberToDigitName = (num) => {
  if (num < 0 || num > 11) return "";
  const digits = "0123456789XW";
  return DIGIT_NAMES[digits[num]];
};
var numberToWords = (decimal) => {
  if (decimal === 0) return "zero";
  if (decimal < 0) return "negative " + numberToWords(-decimal);
  if (decimal < 12) {
    return numberToDigitName(decimal);
  }
  if (decimal < 144) {
    const zenCount = Math.floor(decimal / 12);
    const remainder = decimal % 12;
    if (zenCount === 1 && remainder === 0) return "zen";
    if (zenCount === 1 && remainder > 0) return "zen " + numberToDigitName(remainder);
    if (zenCount > 1 && remainder === 0) return numberToDigitName(zenCount) + "zen";
    return numberToDigitName(zenCount) + "zen " + numberToDigitName(remainder);
  }
  const parts = [];
  let remaining = decimal;
  for (const magnitude of MAGNITUDES) {
    if (remaining >= magnitude.value) {
      const quotient = Math.floor(remaining / magnitude.value);
      remaining = remaining % magnitude.value;
      if (magnitude.name === "") {
        if (quotient > 0) {
          parts.push(numberToDigitName(quotient));
        }
      } else if (magnitude.name === "zen") {
        if (quotient === 1) {
          parts.push("zen");
        } else {
          parts.push(numberToDigitName(quotient) + "zen");
        }
      } else if (magnitude.name === "grod") {
        if (quotient < 12) {
          parts.push(numberToDigitName(quotient) + " grod");
        } else {
          parts.push(numberToWords(quotient) + " grod");
        }
      } else {
        parts.push(numberToWords(quotient) + " " + magnitude.name);
      }
    }
  }
  return parts.join(" ");
};
var dozenalToWords = (dozenal) => {
  let decimal = 0;
  const str = dozenal.toUpperCase().replace(/^Z/, "");
  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    let value;
    if (digit === "X") value = 10;
    else if (digit === "W") value = 11;
    else value = parseInt(digit, 10);
    if (isNaN(value)) return "eroro";
    decimal = decimal * 12 + value;
  }
  return numberToWords(decimal);
};
var readFractionalPart = (fractionalDigits) => {
  const result = [];
  const str = fractionalDigits.toUpperCase();
  for (let i = 0; i < str.length; i += 2) {
    if (i + 1 < str.length) {
      const digit1 = str[i];
      const digit2 = str[i + 1];
      let value1 = DIGIT_NAMES[digit1] ? digit1 === "X" ? 10 : digit1 === "W" ? 11 : parseInt(digit1, 10) : 0;
      let value2 = DIGIT_NAMES[digit2] ? digit2 === "X" ? 10 : digit2 === "W" ? 11 : parseInt(digit2, 10) : 0;
      const pairValue = value1 * 12 + value2;
      result.push(numberToWords(pairValue));
    } else {
      const digit = str[i];
      const name = DIGIT_NAMES[digit];
      if (name) {
        result.push(name);
      }
    }
  }
  return result.join(" ");
};
var showDozenal = (value) => String(value).replaceAll("X", "χ").replaceAll("W", "ε");
var dozenalWithFractionalToWords = (dozenal) => {
  const parts = dozenal.split(/[.,]/);
  if (parts.length === 1) {
    return dozenalToWords(parts[0]);
  }
  const integerWords = dozenalToWords(parts[0]);
  const fractionalWords = readFractionalPart(parts[1]);
  return `${integerWords} koma ${fractionalWords}`;
};
export {
  countLunatosInSol,
  dozenalToWords,
  dozenalWithFractionalToWords,
  toDozenal as formatDozenal,
  fromDozenal,
  getDayProgress,
  getLunatoForSol,
  getLunatoProgress,
  getOzkarCalendar,
  getOzkarClock,
  readFractionalPart,
  loadAstronomicalData as ready,
  toDozenalWithDecimals,
  showDozenal
};

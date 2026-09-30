import { fromDozenal, toDozenalWithDecimals, dozenalWithFractionalToWords, showDozenal } from "/s/lib.js";

const TAU = 2 * Math.PI;
let display = "0";
let previous = null;
let operation = null;
let reset = false;

const screen = document.getElementById("screen");
const words = document.getElementById("words");
const mark = document.getElementById("op");

function show(value) {
  display = value;
  screen.textContent = showDozenal(display);
  mark.textContent = operation || "";
  try {
    words.textContent = dozenalWithFractionalToWords(display);
  } catch {
    words.textContent = "";
  }
  document.querySelectorAll("[data-op]").forEach((button) => {
    const on = button.dataset.op === operation && reset;
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function run(left, right, op) {
  if (op === "+") return left + right;
  if (op === "-") return left - right;
  if (op === "×") return left * right;
  if (op === "÷") return right === 0 ? null : left / right;
  if (op === "^") return left ** right;
  return right;
}

function apply(result) {
  if (result === null || Number.isNaN(result)) {
    show("ERROR");
    reset = true;
    return;
  }
  show(toDozenalWithDecimals(result));
  reset = true;
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const digit = button.dataset.digit;
  const op = button.dataset.op;
  const fn = button.dataset.fn;
  if (digit) {
    if (reset) {
      show(digit);
      reset = false;
    } else {
      show(display === "0" ? digit : display + digit);
    }
    return;
  }
  if (button.dataset.dot !== undefined) {
    if (reset) {
      show("0,");
      reset = false;
    } else if (!display.includes(",") && !display.includes(".")) {
      show(display + ",");
    }
    return;
  }
  if (button.dataset.clear !== undefined) {
    previous = null;
    operation = null;
    reset = false;
    show("0");
    return;
  }
  if (op) {
    const current = fromDozenal(display);
    if (previous !== null && operation && !reset) {
      const result = run(previous, current, operation);
      if (result === null) {
        apply(null);
        previous = null;
        operation = null;
        return;
      }
      previous = result;
      show(toDozenalWithDecimals(result));
    } else {
      previous = current;
    }
    operation = op;
    reset = true;
    show(display);
    return;
  }
  if (button.dataset.eq !== undefined) {
    if (previous === null || !operation) return;
    const result = run(previous, fromDozenal(display), operation);
    previous = null;
    operation = null;
    apply(result);
    return;
  }
  const current = fromDozenal(display);
  if (fn === "sin") apply(Math.sin(current));
  else if (fn === "cos") apply(Math.cos(current));
  else if (fn === "tan") apply(Math.tan(current));
  else if (fn === "asin") apply(current < -1 || current > 1 ? null : Math.asin(current));
  else if (fn === "acos") apply(current < -1 || current > 1 ? null : Math.acos(current));
  else if (fn === "atan") apply(Math.atan(current));
  else if (fn === "sqrt") apply(Math.sqrt(current));
  else if (fn === "square") apply(current * current);
  else if (fn === "ln") apply(Math.log(current));
  else if (fn === "exp") apply(Math.exp(current));
  else if (fn === "tau") apply(TAU);
  else if (fn === "inv") apply(current === 0 ? null : 1 / current);
  else if (fn === "sign") apply(-current);
});

show("0");

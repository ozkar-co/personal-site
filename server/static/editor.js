const field = document.querySelector("#content");
const preview = document.querySelector("#preview");
const tabs = document.querySelector(".tabs");

if (field && preview && tabs) {
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const view = button.dataset.tab === "view";
    if (view) preview.innerHTML = field.value;
    field.hidden = view;
    preview.hidden = !view;
    for (const tab of tabs.querySelectorAll("button")) {
      tab.setAttribute("aria-pressed", tab === button ? "true" : "false");
    }
  });
  field.form.addEventListener("submit", () => {
    field.hidden = false;
  });
}

const field = document.querySelector("#content");
const preview = document.querySelector("#preview");
const tabs = document.querySelector(".tabs");

if (field && preview && tabs) {
  const buttons = [...tabs.querySelectorAll("button")];

  const show = (view) => {
    if (view) preview.innerHTML = field.value;
    else preview.replaceChildren();
    field.hidden = view;
    preview.hidden = !view;
    for (const tab of buttons) {
      tab.setAttribute("aria-pressed", tab.dataset.tab === (view ? "view" : "edit") ? "true" : "false");
    }
  };

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    show(button.dataset.tab === "view");
  });

  field.form.addEventListener("submit", () => {
    show(false);
  });
}

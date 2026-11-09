chrome.storage.sync.get(DEFAULTS, (saved) => {
  const main = document.getElementById("enabled");
  const list = document.getElementById("settings");

  main.checked = saved.enabled;
  list.disabled = !saved.enabled;
  main.addEventListener("change", () => {
    list.disabled = !main.checked;
    chrome.storage.sync.set({ enabled: main.checked });
  });

  for (const { key, label } of SETTINGS) {
    const row = document.createElement("label");
    row.textContent = label;

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = saved[key];
    toggle.addEventListener("change", () => {
      chrome.storage.sync.set({ [key]: toggle.checked });
    });

    row.append(toggle);
    list.append(row);
  }
});

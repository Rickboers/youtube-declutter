// Turns each option on or off by setting html[ydc-<key>] attributes that hide.css
// reacts to, and sends Home to Subscriptions when that option is on.
let settings = { ...DEFAULTS };

function applySettings() {
  for (const { key } of SETTINGS) {
    document.documentElement.toggleAttribute(`ydc-${key}`, settings.enabled && settings[key]);
  }
}

// Send Home to Subscriptions, on direct visits and when YouTube navigates in-page (logo, Home button).
function redirectHome() {
  if (settings.enabled && settings["home-redirect"] && location.pathname === "/") {
    location.replace("/feed/subscriptions");
  }
}

// Apply the defaults right away so hidden things don't flash while saved settings load.
applySettings();

chrome.storage.sync.get(DEFAULTS, (saved) => {
  settings = saved;
  applySettings();
  redirectHome();
});

chrome.storage.onChanged.addListener((changes) => {
  for (const [key, change] of Object.entries(changes)) settings[key] = change.newValue;
  applySettings();
});

document.addEventListener("yt-navigate-finish", redirectHome);

// Every option in the popup. Each key turns on the matching html[ydc-<key>] rules in hide.css.
const SETTINGS = [
  { key: "home-redirect", label: "Send Home to Subscriptions", on: true },
  { key: "home-feed", label: "Hide Home recommendations", on: true },
  { key: "home-button", label: "Hide Home in the sidebar", on: true },
  { key: "shorts", label: "Hide Shorts", on: true },
  { key: "related", label: "Hide recommendations beside videos", on: true },
  { key: "comments", label: "Hide comments", on: false },
  { key: "end-screen", label: "Hide suggestions when a video ends", on: false },
  { key: "most-relevant", label: "Hide Most relevant in Subscriptions", on: false },
  { key: "sidebar-extras", label: "Hide Explore and More from YouTube", on: false },
  { key: "notifications", label: "Hide notification bell", on: false },
];

// "enabled" is the main switch at the top of the popup. Turning it off keeps each option's choice.
const DEFAULTS = { enabled: true, ...Object.fromEntries(SETTINGS.map((s) => [s.key, s.on])) };

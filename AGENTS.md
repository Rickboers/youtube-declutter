# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot and others) working in this repository. Humans are welcome to read it too.

## What this is

A Manifest V3 Chrome extension that hides distracting parts of youtube.com, one switch per thing. Plain JavaScript and CSS, no build step, no dependencies: the repository root is the unpacked extension.

The person you're helping may not be a programmer. Explain what you're doing in plain words, avoid jargon, and tell them exactly what to click when something has to happen in their browser.

## Installing it for someone

You can't click inside Chrome for them, so do the parts you can and walk them through the rest.

1. Get the code onto their computer: `git clone https://github.com/Rickboers/youtube-declutter.git` into a folder they'll keep (for example `~/Documents/youtube-declutter`). Chrome runs the extension from that folder, so it must not be deleted or moved afterwards. Without git, have them use **Code → Download ZIP** on GitHub and unzip it.
2. Tell them the full path of the folder, then these steps:
   1. Open `chrome://extensions` in the address bar.
   2. Turn on **Developer mode** (top right).
   3. Click **Load unpacked** and choose the folder that contains `manifest.json`.
   4. Reload any open YouTube tab.
3. Optional: pin the extension from the puzzle-piece menu so its switches are one click away.

Edge, Brave, Arc, Opera and Vivaldi work the same way (`edge://extensions`, `brave://extensions` and so on). Firefox and Safari are not supported.

After any code change, the person must press the reload arrow on the extension's card in `chrome://extensions` and then reload the YouTube tab. Remind them every time.

## How it works

1. `settings.js` defines `SETTINGS`, the list of switches (`key`, `label`, default `on`), and `DEFAULTS`, which adds the main `enabled` switch.
2. `content.js` runs at `document_start`, reads the saved choices from `chrome.storage.sync` and, for each switch that is on, sets an attribute on the page's root element: `<html ydc-shorts ydc-comments …>`. It applies the defaults first so nothing flashes while saved choices load, and it updates live when a switch changes.
3. `hide.css` has rules like `html[ydc-shorts] ytd-reel-shelf-renderer { display: none !important; }`. A switch does nothing unless a rule uses its attribute.
4. `home-redirect` is the one switch done in JavaScript: on `/`, and after YouTube's in-page navigation (`yt-navigate-finish`), it replaces the address with `/feed/subscriptions`.
5. `popup.js` draws one toggle per entry in `SETTINGS` and saves changes to `chrome.storage.sync`.

## Rules

Keep these unless the person explicitly asks otherwise.

1. **Hide, don't rewrite.** Hide YouTube's elements with CSS in `hide.css`. Don't remove nodes, change YouTube's scripts or intercept its network requests. CSS can't break YouTube and applies before the page paints.
2. **Every switch is opt-out-able and independent.** One `SETTINGS` entry per thing, and each rule depends on exactly one `ydc-<key>` attribute.
3. **Be precise.** Target the exact element, and use `:has()` to hide a container only when it holds the thing. Never hide something the person still needs: playlists, live chat, the transcript and other open panels next to a video must keep working when recommendations are hidden.
4. **No data leaves the browser.** No analytics, telemetry, remote config or third-party scripts. The manifest asks for `storage` only and runs only on `https://www.youtube.com/*`. Don't add permissions without a clear reason, and tell the person if you do: Chrome shows new permissions as a warning.
5. **No build step, no dependencies.** Node is only used for tests.
6. **Never commit personal data**, such as account names, emails, or file paths from your own machine.

## Adding a switch

1. Add `{ key: "my-thing", label: "Hide my thing", on: false }` to `SETTINGS` in `settings.js`. Keys are lowercase words joined by dashes. New switches should start off (`on: false`) unless the person says otherwise, so an update never hides something they expect to see.
2. Add a commented rule to `hide.css`:
   ```css
   /* What this hides, in plain words */
   html[ydc-my-thing] some-youtube-element {
     display: none !important;
   }
   ```
3. Add a row to the README's "What you can hide" table, and an entry to `CHANGELOG.md`.
4. Run `npm test`. It fails if a switch has no rule, or a rule has no switch.

To find the right element, ask the person to right-click the thing on YouTube and choose **Inspect**, or open DevTools yourself if you have a browser. Prefer YouTube's custom element names (`ytd-…`, `yt-…`) and stable attributes (`page-subtype`, `href`, `is-shorts`) over generated class names.

## When YouTube changes

YouTube renames elements now and then and a rule stops matching. Find the new element name in DevTools, update the selector in `hide.css`, and keep the old selector beside it for a while if YouTube is rolling the change out gradually. Check both the full and the collapsed sidebar, and a narrow window, where YouTube uses different elements.

## Checking your work

1. `npm test` (Node 20 or newer, nothing to install). It must pass. `npm run check` also syntax-checks every script.
2. By hand: reload the extension and the YouTube tab, then check every switch you touched both on and off, on the pages it affects (Home, a video, Subscriptions, search, a channel). Make sure nothing else disappeared, the page layout still looks right, and a playlist and a live stream still show their side panel.
3. Keep the README accurate. If a switch changed, the README table and `CHANGELOG.md` change in the same commit.

## Releasing

Bump `version` in both `manifest.json` and `package.json` (semantic versioning), add a dated entry to `CHANGELOG.md`, run `npm test`, then commit. For the Chrome Web Store, zip the extension files (everything except `.git`, `.github`, `test`, `node_modules` and the Markdown files) and upload the zip.

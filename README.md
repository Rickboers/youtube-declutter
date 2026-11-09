# YouTube Declutter

A small Chrome extension that hides the parts of YouTube built to keep you scrolling: **Shorts, the Home feed, recommendations, comments, end screens** and more. You choose what goes, with one switch per thing. Open YouTube for the video you came for, and leave when it's done.

- **Free and open source** (MIT license).
- **Private.** It collects nothing and sends nothing. See [PRIVACY.md](PRIVACY.md).
- **Simple.** No account, no setup, no build step. Works in Chrome, Edge, Brave, Arc and other Chromium browsers.
- **Instant.** Hidden things never flash on screen first.

---

## Install it (about 2 minutes, no coding)

1. **Download** this project: click the green **Code** button at the top of this page, then **Download ZIP**.
2. **Unzip** it. You get a folder called something like `youtube-declutter-main`. Put it somewhere you won't delete it, like your Documents folder. Chrome runs the extension from this folder.
3. Open Chrome and go to **`chrome://extensions`** (type it in the address bar).
4. Turn on **Developer mode** (the switch in the top right corner).
5. Click **Load unpacked** and choose the folder from step 2 (the one that has `manifest.json` inside).
6. Reload any YouTube tab you already had open.

Tip: click the puzzle piece in Chrome's toolbar and pin **YouTube Declutter** so its switches are one click away.

### Or let your AI install it

If you use an AI coding tool (Claude Code, Cursor, Codex, Windsurf, Copilot and the like), you can skip the steps above. Paste this:

> Clone https://github.com/Rickboers/youtube-declutter, read its AGENTS.md, and help me install the extension in my browser.

The [AGENTS.md](AGENTS.md) file tells the AI how the project works, how to install it for you and how to change it safely. You can then ask for changes in plain words, for example:

> Add a switch that hides the Trending page.
>
> Also hide the live chat next to streams.
>
> Turn "Hide comments" on by default.

---

## What you can hide

Click the extension's icon in the toolbar. The switch at the top turns everything on or off at once and remembers each choice underneath.

| Switch | What it does | On at first |
| --- | --- | --- |
| Send Home to Subscriptions | opening YouTube, or clicking its logo, takes you to your subscriptions instead of the Home feed | yes |
| Hide Home recommendations | the Home page shows no videos, in case you land there anyway | yes |
| Hide Home in the sidebar | removes the Home link | yes |
| Hide Shorts | Shorts in the sidebar, and the Shorts shelves in search, subscriptions and channels | yes |
| Hide recommendations beside videos | the column of suggested videos next to the player, so the video sits centred. Playlists, live chat and the transcript still show. | yes |
| Hide comments | the comments under a video | no |
| Hide suggestions when a video ends | end cards and the wall of videos at the end, also in full screen | no |
| Hide Most relevant in Subscriptions | the picked-for-you shelf at the top of your subscriptions | no |
| Hide Explore and More from YouTube | those sections of the sidebar | no |
| Hide notification bell | the bell in the top bar | no |

Changes apply straight away, without reloading. Your choices sync between your computers if you use Chrome sync.

## Troubleshooting

- **Nothing is hidden.** Reload the YouTube tab. Check the extension is switched on in `chrome://extensions` and the main switch in its window is on.
- **Something came back after a YouTube update.** YouTube changes its page now and then, which can undo a rule. Please [open an issue](../../issues) with a screenshot, or ask your AI to fix it using AGENTS.md.
- **I want to see the Home feed once.** Turn off the main switch, look, and turn it back on.
- **Chrome warns about developer mode extensions.** That's normal for anything installed with Load unpacked. You can dismiss it.

## Updating

Download the ZIP again and replace the old folder's contents (or `git pull` if you cloned it), then press the reload arrow on the extension's card in `chrome://extensions`. Your choices stay.

## How it works

No build step and no dependencies: the files in this folder are exactly what Chrome runs. It works by hiding parts of YouTube's page with CSS, which is why nothing flashes and nothing on YouTube's side is changed.

| File | Job |
| --- | --- |
| `manifest.json` | tells Chrome what the extension is and that it runs on youtube.com |
| `settings.js` | the list of switches, their names and whether each starts on |
| `hide.css` | what each switch hides |
| `content.js` | turns the switches on in the page, and sends Home to Subscriptions |
| `popup.html`, `popup.js` | the settings window |
| `test/` | automated checks, run with `npm test` (needs [Node.js](https://nodejs.org) 20 or newer) |

The only permission it asks for is `storage`, to remember your switches.

## Contributing

Bug reports and improvements are welcome, especially when YouTube changes and a rule stops working. Before a pull request, run `npm test` and check the change by hand on YouTube. [AGENTS.md](AGENTS.md) has the project's rules, which apply to people too.

## License

[MIT](LICENSE). Use it, change it, share it.

Not affiliated with or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.

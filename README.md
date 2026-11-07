# Paste to Link

Write or paste notes, edit them with a rich-text editor, and share them with short links. No server, no sign-in.

```
Public link (read-only): https://you.github.io/paste-to-link/view.html#k3x9ab
Dashboard (editing):     https://you.github.io/paste-to-link/
```

## What you can do

- **Create** a note: click **New note**, write or paste, click **Save**.
- **Read** a note: open it from the list, or open its short link.
- **Update** a note: open it and click **Edit**.
- **Delete** a note: click **Delete** twice (there is an **Undo** after).
- Search notes, copy the text, download a `.txt`, export or import all notes.

The editor supports bold, italic, underline, strikethrough, headings, bulleted and numbered lists, quotes, code blocks and links. Pasted text and web content are cleaned so only this safe formatting is kept.

## Cloud sync with JSONBin (optional)

With JSONBin set up, notes sync to a cloud bin automatically and public links work for everyone the moment you save. No export step.

1. Create a **public** bin at jsonbin.io containing `{"version":1,"notes":[]}`.
2. Put its Bin ID in `config.public.js` (safe to commit).
3. Put your key in `config.js` (private, ignored by git). See `config.example.js`. Use `KEY_TYPE: "access"` for an Access Key or `"master"` for the Master Key.
4. Open the dashboard. A badge on the notes page shows **Synced to cloud**. **Sync now** pulls and pushes on demand.

How it behaves:
- Every save goes to the browser first, then to the bin. If the cloud is unreachable the note stays on your device and syncs on the next save.
- Before each write the app reads the latest bin and merges by last-updated time, so two devices rarely overwrite each other.
- The first push into an empty bin also includes anything in `notes.json`.
- `view.html` loads only `config.public.js`. It never loads your key, and reads the bin without one.

**Keep the key private.** `config.js` is only safe on your own computer. If you publish the dashboard (for example on GitHub Pages) without `config.js`, it still works: it reads from the cloud and saves on the device only. If you do upload `config.js`, anyone can read the key and change or delete your bin. Prefer an Access Key over the Master Key, and rotate any key you have pasted into chats or committed.

## Where notes are saved

Notes are saved in two places that work together:

1. **This browser.** Every save is stored locally right away.
2. **`notes.json` in the project.** A static website cannot write to the project by itself, so you add the file yourself:
   1. On the notes page, click **Export**. This downloads `notes.json`.
   2. Replace `notes.json` in the repo with that file and commit it.
   3. Public links like `view.html#k3x9ab` now open for everyone, on any device.

Notes in `notes.json` load for every visitor. If a note is edited in a browser, the newer version wins. Use **Import** to load a `notes.json` into another browser.

## Links

| Link | Looks like | Works for |
| --- | --- | --- |
| Public link (**Copy public link**) | `view.html#k3x9ab` | Anyone, once the note is in `notes.json` (or on the author's browser) |
| Portable public link | `view.html#zXyz...` (long) | Anyone, immediately, with no `notes.json` needed |
| Dashboard link | `index.html#/k3x9ab` | You only: this is where you edit |
| Old links | `index.html#z...` | Still open as "Shared with you", with **Save to my notes** |

## Public page vs dashboard

`view.html` is a separate read-only page. It shows only the title and content: no editor, no toolbar, no buttons, no login, and no link back to the dashboard. It does not load the editor or storage code at all. Editing and deleting only exist on `index.html`.

Note: a static site can't hide the dashboard behind a password, so anyone who knows its address can open it. They would only see notes stored in their own browser plus those in `notes.json`, and their changes never reach your project.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly also works, but `notes.json` can't be loaded that way.

## Host for free (GitHub Pages)

Repo **Settings → Pages → Deploy from a branch → `main` / root**. Your site appears at `https://<username>.github.io/<repo>/`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Dashboard: list, read, edit, shared and message screens |
| `view.html`, `public.js`, `public.css` | Public read-only page |
| `app.js` | Routing, screens and buttons |
| `store.js` | Create, read, update, delete; merges cloud, `notes.json` and browser notes |
| `cloud.js` | Reads and writes the JSONBin bin |
| `config.public.js` | Bin ID (public, safe to commit) |
| `config.js` | Your private key (never commit; see `config.example.js`) |
| `editor.js` | Rich-text editor and toolbar |
| `sanitize.js` | Keeps only safe formatting in pasted or saved content |
| `codec.js` | Compresses text for portable links (deflate + base64url) |
| `design-system.css` | Reusable dark design tokens and components |
| `app.css` | App-only layout |
| `notes.json` | Notes saved in the project |

## Limits

- Notes in a browser only exist on that browser until you export them.
- Anyone with a link can read the note. Nothing is encrypted, so don't store secrets.
- Portable links grow with the note. A warning shows above 2,000 characters, and links over 30,000 are refused.
- Images are not supported.

# Paste to Link

Paste text, get a shareable link. No server, no sign-in, no database.

The text is compressed and stored **inside the link itself** (after the `#`). Anyone who opens the link sees the same text. The part after `#` is never sent to a server.

## Use it

1. Open the site and paste your text.
2. Click **Create link** and copy the link.
3. Whoever opens the link sees the plain text, with **Copy text** and **Download .txt** buttons.

## Run locally

It is a static site. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Host for free (GitHub Pages)

Repo **Settings → Pages → Deploy from a branch → `main` / root**. Your site appears at `https://<username>.github.io/<repo>/`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page (create, view and invalid-link screens) |
| `app.js` | Screen switching and buttons |
| `codec.js` | Text to URL-safe string and back (deflate + base64url) |
| `design-system.css` | Reusable dark design tokens and components |
| `app.css` | App-only layout |

## Limits

- Link length grows with the text. A note appears above 2,000 characters, and links over 30,000 characters are refused.
- Links cannot be edited. Changing the text means a new link.
- Anyone with the link can read the text. It is not encrypted.
- Pasted text is always shown as plain text, never as HTML.

# Revive — Website

Landing page for Revive Digital. Sales-driven web design for solo practitioners.

---

## Files

```
revive_site/
├── index.html    — Page structure and content
├── styles.css    — All styling (design tokens, layout, components, responsive)
├── main.js       — Nav scroll state, animations, CTA click handlers
└── README.md     — This file
```

---

## How to run locally

No build tools needed. Just open `index.html` in a browser.

For best results use a local server to avoid font/asset loading issues:

```bash
# Python (built into macOS/Linux)
cd revive_site
python3 -m http.server 8000
# Then open: http://localhost:8000

# Node (if you have it)
npx serve .
```

---

## Key things to update before launch

### 1. Brand name
Find and replace `Revive` everywhere in `index.html` once the final name is confirmed.

### 2. Contact / booking link
In `main.js`, find the `AUDIT_URL` variable and replace with your actual booking flow:

```js
// Option A — email
const AUDIT_URL = 'mailto:hello@yourdomain.com?subject=Free Site Audit Request';

// Option B — Calendly or Cal.com
window.open('https://cal.com/yourname/audit', '_blank');
```

### 3. Email in footer
Update `hello@revive.co` in `index.html` footer to your real email.

### 4. Meta description
Update the `<meta name="description">` tag in `index.html` once copy is finalized.

### 5. Favicon
Add a `favicon.ico` or `favicon.svg` to the root folder and link it in `<head>`:
```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

---

## Deploying

### Framer / Webflow (recommended)
Rebuild in Framer or Webflow using this as the design reference.
These platforms handle hosting, SSL, and CMS natively.

### Static hosting (quick launch)
Upload the three files to any static host:
- **Netlify** — drag and drop the folder at netlify.com/drop
- **Vercel** — `npx vercel` from the folder
- **GitHub Pages** — push to a repo and enable Pages in settings

### Custom domain
Point your domain's DNS A record to your host's IP, or use their nameservers.
SSL is automatic on Netlify, Vercel, and GitHub Pages.

---

## Design tokens

All colors and core values are CSS custom properties in `styles.css`:

```css
:root {
  --bg:      #f7f4ef;   /* warm off-white background */
  --surface: #ffffff;   /* card/surface white */
  --border:  #e8e3db;   /* subtle warm border */
  --black:   #111009;   /* near-black for text */
  --body:    #6b6358;   /* body copy warm grey */
  --muted:   #b5afa6;   /* secondary/muted text */
  --accent:  #1a6cf0;   /* electric blue — primary action color */
}
```

To swap the accent color (e.g. to red), change `--accent` only.

---

## Fonts

- **Instrument Serif** — headlines, logo, large display text
- **Inter** — body copy, UI labels, buttons

Loaded from Google Fonts. Requires internet connection on first load.
To self-host fonts for performance, download from [Google Fonts](https://fonts.google.com)
and update the `@font-face` declarations in `styles.css`.

---

## Browser support

Modern browsers (Chrome, Safari, Firefox, Edge). 
IE is not supported.
`backdrop-filter` for nav blur degrades gracefully in unsupported browsers.

---

## Copy

All page copy is being workshopped separately in `revive_website_copy.docx`.
Once finalized, update the text content in `index.html` directly.

---

*Built with Claude — Revive Digital 2025*

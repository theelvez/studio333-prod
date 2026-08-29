# studio333 — proposed maison redesign

Jonathan’s fork of the studio333 house site (`theelvez/studio333-prod`). This branch is a static proposal only. It is not a live deploy target in this pull request.

## Pages

| Page | File | Description |
|------|------|-------------|
| House | `index.html` | Maison homepage. Campaign still of Winter Light, wordmark, collection entrance, Bis on Main teaser. |
| Collection | `gallery.html` | Editorial lookbook of all 22 works, plus an immersive viewing room. |
| Featured | `featured.html` | Campaign still of the Bis on Main placement. |
| Contact | `contact.html` | Private inquiries desk. Formspree POST, unchanged endpoint. |
| Share | `qr.html` | Maison share card with the existing gallery QR. |

Wordmark on every page links to `index.html`. Shared chrome: skip link, header, footer, `© 2026 studio333. All rights reserved.`

## Collection

Twenty-two works, titles and files unchanged:

01 Winter Light · 02 Aerial Frost · 03 Veiled Branches · 04 Celestial Drift · 05 Radiant Mist · 06 Silent Echoes · 07 Golden Veil · 08 Twilight Passage · 09 Frosted Horizon · 10 Echoing Stillness · 11 Opaline Dusk · 12 Shifting Silence · 13 Gilded Whisper · 14 Luminous Veins · 15 Hushed Aurora · 16 Crystalline Path · 17 Solstice Veil · 18 Frozen Reverie · 19 Silent Prism · 20 Opal Frost · 21 Aurora Drift · 22 Radiant Spiral.

Medium line on every work: Acrylic, mixed media on canvas.

The lookbook is editorial (full-bleed and offset stills). Clicking a work opens a same-page viewing room: image, title, medium, index, previous/next, close. Arrow keys, Escape, and swipe. Hash `#work-01` … `#work-22` opens a work directly.

## Stack

- HTML, CSS, and vanilla JavaScript only. No backend, no build step, no paid APIs.
- Google Fonts: Bodoni Moda (wordmark and titles) and Inter Tight (UI, labels, body).
- Contact form posts to the existing Formspree endpoint. Honeypot field `_gotcha` and hidden `_subject` (`New studio333 inquiry`) are unchanged.

## Assets (unchanged)

- `assets/art-01.jpg` — `art-22.jpg`
- `assets/bis/Bis_1.jpg`
- `assets/QR/qr-code-new.png`

Do not delete or rename artwork files.

## Local preview

Open any HTML file in a browser, or:

```bash
python3 -m http.server 8000
```

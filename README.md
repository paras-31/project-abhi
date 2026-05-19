# VD Brother Projects Private Limited — Company Website

A modern, fully responsive, informative website for **VD Brother Projects Pvt Ltd**, built with plain HTML, CSS and vanilla JavaScript. No build step, no database, no dependencies — just open and run.

---

## Company at a glance

| | |
|---|---|
| **Company Name** | VD Brother Projects Private Limited |
| **Date of Incorporation** | 17 July 2021 |
| **Registered Office** | Gita Yadav W/O Sh. Virender Yadav, Near Doon College, Shyampur, Rishikesh, Dehradun, Uttarakhand — 249204, India |
| **Phone** | +91 86307 93994 |
| **Email** | vdbrothersprojectpvtltd@gmail.com |
| **Directors** | Mr. Dharmender Yadav · Mr. Virendra Kumar Yadav |
| **Working Areas** | Gas Pipeline · Home Construction · Commercial Construction · Skill Development (fees-based) |

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, stats, services overview, about preview, CTAs |
| `about.html` | Company story, mission/vision/values, directors, snapshot |
| `services.html` | Overview of all four services + 4-step process |
| `gas-pipeline.html` | Detailed gas pipeline service page |
| `home-construction.html` | Detailed residential construction page |
| `commercial-construction.html` | Detailed commercial construction page |
| `skill-development.html` | Training programs, courses and enrollment steps |
| `projects.html` | Project gallery showcasing recent work |
| `contact.html` | Contact details, enquiry form, embedded Google Map |

---

## How to run

### Option 1 — Just open in a browser
1. Open the project folder.
2. Double-click `index.html`.

That's it.

### Option 2 — Run a tiny local server (recommended)
A local server avoids any CORS/iframe quirks and behaves exactly like production.

**Python (already on macOS/Linux):**
```bash
cd project-abhi
python3 -m http.server 8000
```
Then open <http://localhost:8000>

**Or VS Code:** install the **Live Server** extension → right-click `index.html` → "Open with Live Server".

---

## Project structure

```
project-abhi/
├── index.html
├── about.html
├── services.html
├── gas-pipeline.html
├── home-construction.html
├── commercial-construction.html
├── skill-development.html
├── projects.html
├── contact.html
├── css/
│   └── style.css         # All site styling (theme tokens, components, responsive)
├── js/
│   └── main.js           # Mobile nav, scroll header, counters, reveal-on-scroll, form
├── assets/
│   ├── images/           # Drop your real project photos here
│   └── videos/           # Drop your background MP4s here (overrides stock videos)
└── README.md
```

---

## Customizing

### Update text
All page content is plain HTML — just edit any `.html` file directly.

### Change colors / theme
All colors are CSS variables at the top of `css/style.css`:
```css
:root {
  --color-primary: #0f2a47;   /* Navy */
  --color-accent:  #f5a623;   /* Gold */
  --color-secondary: #1e88c7; /* Blue */
}
```
Change once → reflects across the whole site.

### Swap the background videos with your own

Every page hero plays a looping background video. By default, the site uses free Mixkit stock videos (construction, aerial drone, welding, etc.) served from their CDN. **No setup required** — it just works out of the box.

**To replace any page's background video with your own:**

1. Drop an MP4 into `assets/videos/` using the exact filename below.
2. Hard-refresh the page (Cmd/Ctrl + Shift + R).

That's it — the JavaScript automatically detects the local file via a `HEAD` request, prepends it as a `<source>` and falls back to the remote video if your file is ever removed. No HTML edits needed.

| Page | Drop file as |
|---|---|
| Home | `assets/videos/hero.mp4` |
| About | `assets/videos/about.mp4` |
| Services | `assets/videos/services.mp4` |
| Gas Pipeline | `assets/videos/gas-pipeline.mp4` |
| Home Construction | `assets/videos/home-construction.mp4` |
| Commercial Construction | `assets/videos/commercial.mp4` |
| Skill Development | `assets/videos/skill-development.mp4` |
| Projects | `assets/videos/projects.mp4` |
| Contact | `assets/videos/contact.mp4` |

**Recommended video specs:** 1280×720 or 1920×1080, 10–20 seconds, looped, **muted audio** (autoplay only works on muted videos), MP4 (H.264) under ~5 MB for fast loading.

**To disable a video entirely on a page**, delete the `<video class="bg-video">…</video>` block from that HTML file — the navy gradient fallback will still look great.

**Why this works:**  HTML5's native `<source>` fallback only switches between sources for codec issues, not for HTTP 404 errors. So we use JavaScript to check for local files first — this gives you the "drop a file and it just works" behavior without breaking when no file is present.

### Swap the photos with your own

The site uses real construction photos from Unsplash CDN by default (zero config). To use your own:

1. Drop JPG/PNG files into `assets/images/`.
2. Search for the URL you want to replace (e.g. `images.unsplash.com/photo-1541888946425-...`) and change to a relative path:
   ```html
   <img src="assets/images/your-photo.jpg" alt="..." />
   ```

Places photos are used:
- **Home page** — about section, "Our Work" gallery (7 photos)
- **About page** — about section visual
- **Each service page** — large visual photo + page-hero poster
- **Projects page** — 6 project cards

### Update logo
The "VD" badge in the navbar lives in every HTML file as:
```html
<div class="logo-mark">VD</div>
```
Swap with an `<img src="assets/images/logo.png" alt="VD" />` if/when you have a logo.

---

## Hosting (all free)

This is a 100% static site — host anywhere:

- **Netlify** — drag the folder onto <https://app.netlify.com/drop>
- **Vercel** — `vercel deploy` from this folder
- **GitHub Pages** — push to a repo and enable Pages
- **Hostinger / cPanel** — upload via FTP to `public_html/`

---

## Adding a Node.js backend later (when you actually need it)

This site is **fully compatible** with a Node.js backend in the future. Two clean upgrade paths:

### Path A — Keep static frontend, add Node only for APIs (recommended)
Useful for: handling the contact form, sending emails, storing enrolment requests.

```
project-abhi/
├── index.html            ← unchanged
├── (all other .html)     ← unchanged
├── css/, js/, assets/    ← unchanged
└── server/               ← NEW
    ├── package.json
    └── index.js          ← Express server
```

Example `server/index.js`:
```js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('..'));  // serve all the HTML/CSS as-is

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  // TODO: send email / save to DB / forward to WhatsApp
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

Then in `js/main.js`, change the contact-form handler to POST to `/api/contact`. **Nothing else changes.**

### Path B — Migrate to React/Next.js
If later you need dashboards, user logins, or a learner portal:
- All the CSS in `css/style.css` can be copy-pasted into a React project directly.
- All the HTML markup converts 1-to-1 to JSX (`class=` → `className=`).
- Nothing here is wasted.

---

## Browser support

Works on all modern browsers (Chrome, Edge, Firefox, Safari) on desktop, tablet and mobile.

---

## Credits

- Fonts: [Poppins](https://fonts.google.com/specimen/Poppins) + [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- Icons: [Font Awesome 6](https://fontawesome.com/) (CDN)
- Stock photos: [Unsplash](https://unsplash.com/) (free, hot-link allowed) — to be replaced with real site photos
- Stock videos: [Mixkit](https://mixkit.co/free-stock-video/) (free, CDN hot-link allowed) — to be replaced with your own MP4s
- Map: Google Maps embed

---

© VD Brother Projects Private Limited. All rights reserved.

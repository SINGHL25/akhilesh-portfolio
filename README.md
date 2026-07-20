# Akhilesh Kumar Singh — Portfolio

A fast, zero-build portfolio site for an ITS &amp; tolling maintenance and assurance
engineer. Static HTML/CSS/JS — no framework, no build step, deploys to GitHub Pages
in about five minutes.

**Live:** _add your URL after deploying_
**Stack:** HTML5 · modern CSS · vanilla JS (no dependencies) · Google Fonts

---

## What's here

```
portfolio/
├── index.html        # the whole site (one page, sectioned)
├── css/styles.css    # design system + layout
├── js/main.js        # theme toggle, nav, scroll reveal, stat counters, on-demand CV
├── assets/           # drop your banner / images here
└── README.md
```

The "Download CV" button opens a clean, print-to-PDF résumé generated from the same
content — so there's no binary to keep in sync. Replace it with a real PDF link if you
prefer (`assets/akhilesh-singh-cv.pdf`).

---

## Run locally

No tooling needed. Either open `index.html` directly, or serve it:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Deploy to GitHub Pages (5 minutes)

1. Create a repo, e.g. `akhilesh-portfolio` (or `SINGHL25.github.io` for a root URL).
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Portfolio v1"
   git branch -M main
   git remote add origin https://github.com/SINGHL25/akhilesh-portfolio.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `root` → Save.
4. Your site goes live at `https://SINGHL25.github.io/akhilesh-portfolio/` within a minute or two.

### Custom domain (optional)
Add a `CNAME` file containing your domain (e.g. `akhileshsingh.dev`), point a DNS
`CNAME` record at `SINGHL25.github.io`, then set the domain under Settings → Pages.

---

## Deploy to Vercel (alternative)

Import the repo at [vercel.com/new](https://vercel.com/new). No framework preset needed —
it serves the static files as-is. Every push to `main` redeploys automatically.

---

## Editing content

Everything is plain HTML in `index.html`, grouped by section with clear comments
(`<!-- ============ WORK ============ -->` etc.). To change:

- **Numbers/stats** → the `.stats` section (`data-count` drives the count-up animation).
- **Projects** → `.work__grid` — each `<article class="card">` is one project.
- **Experience** → the `.timeline` list.
- **Skills** → `.skills__grid`.
- **Accent colour** → `--orange` at the top of `css/styles.css`.

---

## Roadmap (if you want to grow it)

This v1 is deliberately a single, reliable page. Natural next steps:

- Migrate to **Next.js + Tailwind** for multi-page routing and MDX case studies.
- Add a **RAG recruiter chatbot** (LangChain + your CV) — ties directly to your DocSage work.
- Case-study pages for RoadAid AI and the tolling analytics with architecture diagrams.
- Wire the contact section to a form service (Formspree / a serverless function).

---

© Akhilesh Kumar Singh · Brisbane, Australia

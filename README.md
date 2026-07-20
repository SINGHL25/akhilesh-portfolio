# Akhilesh Kumar Singh — Portfolio

Interactive portfolio for an ITS &amp; tolling maintenance and assurance engineer.
The site is **static and zero-build** — it deploys to GitHub Pages as-is. An
optional Python service adds a real LangChain RAG recruiter chatbot.

**Live:** _add your URL after deploying_

```
akhilesh-portfolio/
├── index.html                     # homepage — live MLFF tolling simulation, work, timeline, skills
├── css/
│   └── case.css                   # shared styles for the case-study pages
├── js/
│   └── chatbot.js                 # recruiter chatbot widget (client-side, upgrades to backend)
├── case-studies/
│   ├── roadaid-ai.html            # deep dive: computer-vision incident detection
│   └── tolling-analytics.html     # deep dive: passage analytics & anomaly detection
├── chatbot-api/                   # OPTIONAL — FastAPI + LangChain RAG backend
│   ├── app.py
│   ├── knowledge/akhi.md          # the CV knowledge base the assistant answers from
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
└── README.md
```

## What's inside

- **Live tolling simulation** (homepage): vehicles pass a gantry, get detected,
  classified, charged and reconciled in real time. Inject a *silent sensor drift*
  and watch the assurance layer catch what the road never shows.
- **Recruiter chatbot** (bottom-right "Ask about Akhi"): answers questions from
  the CV. Works with no backend; set one URL to upgrade it to the LangChain RAG
  service in `chatbot-api/`.
- **Two case studies**: RoadAid AI and the tolling analytics pipeline.
- **On-the-fly CV**: the "Download CV" button generates a print-to-PDF résumé.

## Run locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

(The chatbot backend is separate — see `chatbot-api/README.md`.)

## Deploy the site (GitHub Pages)

Push to GitHub, then **Settings → Pages → Deploy from a branch → `main` / root**.
Live at `https://<user>.github.io/<repo>/`. Full commands are in the project
setup guide.

## Deploy the chatbot (optional)

See `chatbot-api/README.md` — deploy to Render/Railway, then set
`window.RECRUITER_API_URL` in `index.html` to your `/ask` endpoint.

---

© Akhilesh Kumar Singh · Brisbane, Australia

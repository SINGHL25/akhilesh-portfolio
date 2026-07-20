# Recruiter assistant — RAG backend (FastAPI + LangChain)

A small retrieval-augmented API that answers recruiter questions about Akhilesh
**strictly from `knowledge/akhi.md`**. Same pattern as DocSage AI, pointed at a CV.

```
question ──▶ FAISS retriever (OpenAI embeddings) ──▶ top-k chunks
                                                      │
                          ChatOpenAI (gpt-4o-mini) ◀──┘  +  system prompt
                                     │
                                     ▼
                              { "answer": "..." }
```

The static site works **without** this backend (the widget falls back to
client-side answers). Deploy this only when you want full LLM-quality replies.

## Run locally

```bash
cd chatbot-api
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # add your OPENAI_API_KEY
uvicorn app:app --reload --port 8000
```

Test it:

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is his ITS experience?"}'
```

The FAISS index builds automatically on first run from `knowledge/akhi.md`
(delete the `faiss_index/` folder to rebuild after editing the knowledge base).

## Connect it to the site

In `../index.html`, near the bottom, set:

```html
<script>window.RECRUITER_API_URL = "https://your-host/ask";</script>
```

The widget will POST questions there and render the LLM answer, falling back to
the built-in answers if the backend is unreachable.

## Deploy (Render — free tier friendly)

1. Push this repo to GitHub.
2. On [render.com](https://render.com) → New → Web Service → pick the repo.
3. Root directory: `chatbot-api`. Runtime: Python.
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add environment variable `OPENAI_API_KEY`.
5. Deploy, then set `window.RECRUITER_API_URL` to `https://<service>.onrender.com/ask`.

Railway and Fly.io work the same way. For production, change `allow_origins=["*"]`
in `app.py` to your actual site origin.

## Cost note
Uses `text-embedding-3-small` and `gpt-4o-mini` — both inexpensive. Embedding the
CV is a fraction of a cent; each answer is well under a cent at these models.
Swap `ChatOpenAI` for `ChatAnthropic` (langchain-anthropic) if you prefer Claude.

"""
Recruiter assistant — FastAPI + LangChain RAG backend.

Answers questions about Akhilesh Kumar Singh strictly from knowledge/akhi.md.
Exposes POST /ask  { "question": "..." }  ->  { "answer": "..." }

Run locally:
    pip install -r requirements.txt
    cp .env.example .env   # add your OPENAI_API_KEY
    uvicorn app:app --reload --port 8000

The static site's chatbot widget will call this once you set
    window.RECRUITER_API_URL = "https://<your-host>/ask"
in index.html.
"""
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_text_splitters import MarkdownTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

load_dotenv()

KNOWLEDGE = Path(__file__).parent / "knowledge" / "akhi.md"
INDEX_DIR = Path(__file__).parent / "faiss_index"

SYSTEM_PROMPT = """You are a concise, professional assistant answering a recruiter's \
questions about Akhilesh Kumar Singh (an ITS & tolling maintenance and assurance engineer).

Rules:
- Answer ONLY from the context below. Do not invent facts, employers, dates or numbers.
- If the answer isn't in the context, say you don't have that detail and suggest emailing \
akhi.singh1989@gmail.com.
- Keep answers to 2-4 sentences unless asked for more. Australian English. Speak about Akhi \
in the third person. Never fabricate.

Context:
{context}
"""


def build_or_load_retriever():
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    if INDEX_DIR.exists():
        store = FAISS.load_local(
            str(INDEX_DIR), embeddings, allow_dangerous_deserialization=True
        )
    else:
        text = KNOWLEDGE.read_text(encoding="utf-8")
        docs = MarkdownTextSplitter(chunk_size=800, chunk_overlap=120).create_documents([text])
        store = FAISS.from_documents(docs, embeddings)
        store.save_local(str(INDEX_DIR))
    return store.as_retriever(search_kwargs={"k": 4})


retriever = build_or_load_retriever()
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
prompt = ChatPromptTemplate.from_messages([("system", SYSTEM_PROMPT), ("human", "{question}")])


def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)


chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

app = FastAPI(title="Recruiter assistant — Akhilesh Kumar Singh")

# Allow the static site (any origin) to call the API. Lock this down to your
# GitHub Pages / custom domain in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


class Query(BaseModel):
    question: str


@app.get("/")
def health():
    return {"status": "ok", "service": "recruiter-assistant"}


@app.post("/ask")
def ask(q: Query):
    question = (q.question or "").strip()
    if not question:
        return {"answer": "Ask me anything about Akhi's experience, projects or availability."}
    try:
        answer = chain.invoke(question)
    except Exception as exc:  # pragma: no cover
        answer = (
            "I hit an error answering that. You can reach Akhi directly at "
            "akhi.singh1989@gmail.com."
        )
        print("error:", exc)
    return {"answer": answer}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import requests

from crew.crew import run_chatbot as run_crew_chatbot

ENTRY_API_URL = os.getenv("ENTRY_API_URL", "http://localhost:8000/entries")

def _get_document_context() -> str:
    """
        Load all stored entries from the backend and format them for the LLM prompt.
    """

    response = requests.get(ENTRY_API_URL, timeout=30)
    response.raise_for_status()
    entries = response.json()

    if not entries:
        return "Es sind aktuell keine Dokumente in der Datenbank gespeichert."

    formattedEntries = []
    for entry in entries:
        originalText = (entry.get("originalText") or "").strip()
        title = entry.get("title") or f"Dokument {entry.get('id')}"
        formattedEntries.append(
            f"Dokument {entry.get('id')}: {title}\n"
            f"Typ: {entry.get('type', '')}\n"
            f"Schwierigkeit: {entry.get('difficulty', '')}\n"
            f"Originaltext: {originalText or '[kein Text verfügbar]'}\n"
            f"Wichtiger Hinweis: Der eigentliche Inhaltsbereich dieses Dokuments befindet sich im Feld 'Originaltext'. "
            f"Bei Fragen zum Inhalt soll die KI genau diesen Bereich als Hauptquelle verwenden."
        )

    return "\n\n".join(formattedEntries)

app = FastAPI()

# Allow requests from the Expo app (any origin during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Chatbot ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(request: ChatRequest):
    print("CHAT REQUEST:", request.message)
    try:
        answer = run_crew_chatbot(
            message=request.message, 
            document_context=_get_document_context()
        )
        return {"response": answer}
    except Exception as e:
        print("CHAT ERROR:", str(e))
        return {"response": "Error: Kommunikationsfehler mit CrewAI", "error": str(e)}


# ── Translation ───────────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str
    source_lang: str   # e.g. "Englisch" or "English"
    target_lang: str   # e.g. "Deutsch" or "German"


@app.post("/translate")
def translate(request: TranslateRequest):
    print(f"TRANSLATE (CrewAI): '{request.text}' [{request.source_lang} → {request.target_lang}]")
    try:
        from crew.crew import run_translation
        result = run_translation(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
        print("TRANSLATION:", result)
        return {"translation": result}
    except Exception as e:
        print("TRANSLATE ERROR:", str(e))
        return {"translation": "", "error": str(e)}


# ── Simplification (Einfache Sprache, German only) ───────

class SimplifyRequest(BaseModel):
    text: str


@app.post("/simplify")
def simplify(request: SimplifyRequest):
    print(f"SIMPLIFY (CrewAI): '{request.text}'")
    try:
        from crew.crew import run_simplification
        result = run_simplification(text=request.text)
        print("SIMPLIFIED:", result)
        return {"simplified": result}
    except Exception as e:
        print("SIMPLIFY ERROR:", str(e))
        return {"simplified": "", "error": str(e)}
    
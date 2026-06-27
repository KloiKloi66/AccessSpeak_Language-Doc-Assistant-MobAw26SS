from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crewai import Crew

from ai_agents.tasks import scan_task
from ai_agents.ScanningAgent import document_agent
from chatbot import ask_chatbot
from translate import translate_text
from simplify import simplify_text

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


# -------------------------
# CHAT 
# -------------------------
@app.post("/chat")
def chat(request: ChatRequest):
    print("CHAT REQUEST:", request.message)
    try:
        answer = ask_chatbot(request.message)
        print("CHAT ANSWER:", answer)
        return {"response": answer}
    except Exception as e:
        print("CHAT ERROR:", str(e))
        return {"response": "Fehler im Backend", "error": str(e)}


# ── Translation ───────────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str
    source_lang: str   # e.g. "Englisch" or "English"
    target_lang: str   # e.g. "Deutsch" or "German"


@app.post("/translate")
def translate(request: TranslateRequest):
    print(f"TRANSLATE: '{request.text}' [{request.source_lang} → {request.target_lang}]")
    try:
        result = translate_text(
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
    print(f"SIMPLIFY: '{request.text}'")
    try:
        result = simplify_text(text=request.text)
        print("SIMPLIFIED:", result)
        return {"simplified": result}
    except Exception as e:
        print("SIMPLIFY ERROR:", str(e))
        return {"simplified": "", "error": str(e)}


# ── CrewAI Translation ────────────────────────────────────

@app.post("/crew/translate")
def crew_translate(request: TranslateRequest):
    print(f"CREW TRANSLATE: '{request.text}' [{request.source_lang} → {request.target_lang}]")
    try:
        from ai_agents.crew.crew import run_translation
        result = run_translation(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
        print("CREW TRANSLATION:", result)
        return {"translation": result}
    except Exception as e:
        print("CREW TRANSLATE ERROR:", str(e))
        return {"translation": "", "error": str(e)}


# ── CrewAI Simplification ─────────────────────────────────

@app.post("/crew/simplify")
def crew_simplify(request: SimplifyRequest):
    print(f"CREW SIMPLIFY: '{request.text}'")
    try:
        from ai_agents.crew.crew import run_simplification
        result = run_simplification(text=request.text)
        print("CREW SIMPLIFIED:", result)
        return {"simplified": result}
    except Exception as e:
        print("CREW SIMPLIFY ERROR:", str(e))
        return {"simplified": "", "error": str(e)}



# -------------------------
# CREW
# -------------------------
@app.post("/scan")
def scan_document():

    try:
        crew = Crew(
            agents=[document_agent],
            tasks=[scan_task],
            verbose=True
        )

        result = crew.kickoff(
            inputs={"image_path": "ai_agents/test.png"}  # oder "data/test.png"
        )

        return {
            "result": result
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "error": str(e),
            "message": "Fehler beim Dokument-Scan"
        }
    
    #uvicorn ai_agents.main:app --reload  THEN http://127.0.0.1:8000/docs#/default/scan_document_scan_post
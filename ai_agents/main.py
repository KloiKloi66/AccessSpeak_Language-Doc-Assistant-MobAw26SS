from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import ask_chatbot
from translate import translate_text

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

import os
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

def simplify_text(text: str) -> str:
    """
    Rewrites German text in "Einfache Sprache" using a local Ollama model.
    German only.
    """

    prompt = (
        "Schreibe den folgenden deutschen Text in Einfacher Sprache um. "
        "Regeln: kurze Sätze (max. 12 Wörter), häufige und einfache Wörter, "
        "Aktiv statt Passiv, keine Fremdwörter oder Amtsdeutsch. "
        "Erkläre schwierige Begriffe in Klammern, wenn nötig. "
        "Der Inhalt muss vollständig und korrekt bleiben. "
        "Antworte NUR mit dem umgeschriebenen Text, ohne Erklärungen, "
        "ohne Anführungszeichen, ohne zusätzliche Formatierung.\n\n"
        f"Text: {text}"
    )

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()
    return data["response"].strip()

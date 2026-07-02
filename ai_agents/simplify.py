import os
import re
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# Preamble lines the model sometimes adds despite instructions,
# e.g. "Hier ist die Übersetzung:" or "Gerne! Hier ist der Text:"
PREAMBLE_PATTERN = re.compile(
    r"^(hier ist|hier kommt|gerne|sicher|natürlich|klar)\b[^\n]{0,80}:\s*\n+",
    re.IGNORECASE,
)

def _strip_preamble(text: str) -> str:
    return PREAMBLE_PATTERN.sub("", text, count=1).strip()

def simplify_text(text: str) -> str:
    """
    Rewrites German text in "Einfache Sprache" using a local Ollama model.
    German only.
    """

    prompt = (
        "Du bist KEIN Übersetzer. Du schreibst deutschen Text in "
        "Einfacher Sprache um (Deutsch zu einfachem Deutsch). "
        "Regeln: kurze Sätze (max. 12 Wörter), häufige und einfache Wörter, "
        "Aktiv statt Passiv, keine Fremdwörter oder Amtsdeutsch. "
        "Erkläre schwierige Begriffe in Klammern, wenn nötig. "
        "Der Inhalt muss vollständig und korrekt bleiben. "
        "WICHTIG: Deine Antwort beginnt direkt mit dem ersten Wort des "
        "umgeschriebenen Textes. Keine Einleitung wie 'Hier ist...', "
        "keine Erklärungen, keine Anführungszeichen, keine Formatierung.\n\n"
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
    return _strip_preamble(data["response"].strip())

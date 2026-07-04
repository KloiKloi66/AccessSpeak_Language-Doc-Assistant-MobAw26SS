import os
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
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


def ask_chatbot(message: str) -> str:
    """
        Ask the chatbot a question about any topic or related to the documents registered in the system.
        The chatbot has knowledge about the documents and can answer questions about it or give tips on how to use the documents.
    """

    document_context = _get_document_context()

    prompt = (
        "Du bist ein hilfreicher Assistent, der allgemeine Fragen zu jeglichen Themen und spezifische Fragen zu den Dokumenten im System beantwortet. "
        "Nutze die folgenden Dokumente und deren Inhalte als Wissensgrundlage.\n\n"
        f"Dokumente:\n{document_context}\n\n"
        f"Nutzerfrage: {message}\n\n"
        "Antworte standardmäßig auf Deutsch, basierend auf den bereitgestellten Dokumenten. "
        "Einzige Außnahme ist, wenn die Nutzerfrage ausdrücklich in einer anderen Sprache verfasst ist, dann antworte in dieser Sprache. "
        "Wenn die Antwort nicht in den Dokumenten enthalten ist, sage klar, dass die Information nicht verfügbar ist."
    )

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()
    return data.get("response", "[CHATBOT] No ollama response.")
import os
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

def ask_chatbot(message: str) -> str:
    """
        Ask the chatbot a question about any topic or related to the documents registered in the system.
        The chatbot has knowledge about the documents and can answer questions about it or give tips on how to use the documents.
    """

    document_context = "wip"
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